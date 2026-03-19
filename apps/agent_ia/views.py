from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.core.cache import cache
from django.conf import settings

from .models import MessageIA
from .kotizo_knowledge import KOTIZO_KNOWLEDGE, MOTS_INTERDITS


def verifier_limite_ia(user):
    # verifie la limite journaliere de messages IA
    cache_key = f'ia_count_{user.id}'
    count = cache.get(cache_key, 0)
    limites = settings.IA_DAILY_LIMITS
    limite = limites.get(user.niveau, limites['basic'])
    return count < limite, count, limite


def incrementer_compteur_ia(user):
    cache_key = f'ia_count_{user.id}'
    count = cache.get(cache_key, 0)
    cache.set(cache_key, count + 1, timeout=86400)


def detecter_injection(message):
    message_lower = message.lower()
    for mot in MOTS_INTERDITS:
        if mot.lower() in message_lower:
            return True
    return False


def verifier_blacklist_ia(user):
    cache_key = f'ia_blacklist_{user.id}'
    return cache.get(cache_key, False)


def incrementer_tentatives_injection(user):
    cache_key = f'ia_injections_{user.id}'
    tentatives = cache.get(cache_key, 0) + 1
    cache.set(cache_key, tentatives, timeout=3600)

    if tentatives >= 5:
        # blacklist 1h
        cache.set(f'ia_blacklist_{user.id}', True, timeout=3600)
        cache.delete(cache_key)

    return tentatives


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def envoyer_message(request):
    message = request.data.get('message', '').strip()

    if not message:
        return Response({'error': 'Message vide'}, status=status.HTTP_400_BAD_REQUEST)

    if len(message) > 1000:
        return Response({'error': 'Message trop long (1000 caracteres max)'}, status=status.HTTP_400_BAD_REQUEST)

    # verifier blacklist injection
    if verifier_blacklist_ia(request.user):
        return Response({
            'error': 'Acces temporairement suspendu',
            'code': 'blacklist'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    # detecter injection
    if detecter_injection(message):
        tentatives = incrementer_tentatives_injection(request.user)
        return Response({
            'error': 'Message non autorise',
            'code': 'injection'
        }, status=status.HTTP_400_BAD_REQUEST)

    # verifier limite journaliere
    autorise, count, limite = verifier_limite_ia(request.user)
    if not autorise:
        return Response({
            'error': f'Limite journaliere atteinte ({limite} messages/jour)',
            'code': 'limite_ia',
            'count': count,
            'limite': limite
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    # recuperer historique du jour
    debut_journee = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    historique = MessageIA.objects.filter(
        utilisateur=request.user,
        date_creation__gte=debut_journee
    ).order_by('date_creation')

    # construire messages pour Gemini
    messages_gemini = []
    for msg in historique:
        messages_gemini.append({
            'role': msg.role,
            'parts': [{'text': msg.contenu}]
        })
    messages_gemini.append({
        'role': 'user',
        'parts': [{'text': message}]
    })

    # sauvegarder message user
    MessageIA.objects.create(
        utilisateur=request.user,
        role='user',
        contenu=message
    )

    # appel Gemini
    reponse_texte = _appeler_gemini(messages_gemini)

    # sauvegarder reponse
    MessageIA.objects.create(
        utilisateur=request.user,
        role='assistant',
        contenu=reponse_texte
    )

    # incrementer compteur
    incrementer_compteur_ia(request.user)

    return Response({
        'reponse': reponse_texte,
        'count': count + 1,
        'limite': limite
    })


def _appeler_gemini(messages):
    import google.generativeai as genai
    import os

    api_key = os.getenv('GEMINI_API_KEY', '')
    if not api_key or api_key == 'placeholder':
        return "L'agent IA n'est pas configure pour le moment."

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name='gemini-2.0-flash',
            system_instruction=KOTIZO_KNOWLEDGE
        )

        chat = model.start_chat(history=messages[:-1])
        response = chat.send_message(messages[-1]['parts'][0]['text'])
        return response.text

    except Exception as e:
        return "Je rencontre une difficulte technique. Reessayez dans quelques instants."


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historique_messages(request):
    debut_journee = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    messages = MessageIA.objects.filter(
        utilisateur=request.user,
        date_creation__gte=debut_journee
    ).order_by('date_creation')

    data = [{'role': m.role, 'contenu': m.contenu, 'date': m.date_creation} for m in messages]

    autorise, count, limite = verifier_limite_ia(request.user)
    return Response({
        'messages': data,
        'count': count,
        'limite': limite
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def statut_ia(request):
    autorise, count, limite = verifier_limite_ia(request.user)
    blackliste = verifier_blacklist_ia(request.user)

    return Response({
        'count': count,
        'limite': limite,
        'disponible': autorise and not blackliste,
        'blackliste': blackliste
    })