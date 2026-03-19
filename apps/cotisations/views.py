from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings

from .models import Cotisation, Participation, CommentaireCotisation, SignalementCotisation
from .serializers import (
    CotisationSerializer, CotisationCreerSerializer,
    ParticipationSerializer, CommentaireSerializer,
    CommentaireCreerSerializer, SignalementSerializer
)


def verifier_limite_journaliere(user):
    # verifie la limite de cotisations creees aujourd'hui (reset minuit Lome)
    from django.utils import timezone
    from datetime import datetime
    import pytz

    lome = pytz.timezone('Africa/Lome')
    maintenant = timezone.now().astimezone(lome)
    debut_journee = lome.localize(datetime(maintenant.year, maintenant.month, maintenant.day, 0, 0, 0))

    count = Cotisation.objects.filter(
        createur=user,
        date_creation__gte=debut_journee
    ).count()

    limites = settings.COTISATION_DAILY_LIMITS
    limite = limites.get(user.niveau, limites['basic'])

    return count < limite, count, limite


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def cotisations_liste_creer(request):
    if request.method == 'GET':
        cotisations = Cotisation.objects.filter(statut='active').select_related('createur')
        serializer = CotisationSerializer(cotisations, many=True)
        return Response(serializer.data)

    # POST - creer une cotisation
    autorise, count, limite = verifier_limite_journaliere(request.user)
    if not autorise:
        return Response({
            'error': f'Limite journaliere atteinte ({limite} cotisations par jour)',
            'code': 'limite_atteinte',
            'count': count,
            'limite': limite
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    serializer = CotisationCreerSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    cotisation = serializer.save(createur=request.user)
    return Response(CotisationSerializer(cotisation).data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def cotisation_detail(request, slug):
    cotisation = get_object_or_404(Cotisation, slug=slug)

    if request.method == 'GET':
        serializer = CotisationSerializer(cotisation)
        return Response(serializer.data)

    # DELETE - annuler (createur seulement)
    if cotisation.createur != request.user:
        return Response({'error': 'Non autorise'}, status=status.HTTP_403_FORBIDDEN)

    if cotisation.participations.filter(statut='payee').exists():
        return Response(
            {'error': 'Impossible d annuler une cotisation avec des paiements confirmes'},
            status=status.HTTP_400_BAD_REQUEST
        )

    cotisation.statut = 'annulee'
    cotisation.save()
    return Response({'message': 'Cotisation annulee'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mes_cotisations(request):
    creees = Cotisation.objects.filter(createur=request.user).select_related('createur')
    participees = Participation.objects.filter(
        membre=request.user
    ).select_related('cotisation__createur')

    return Response({
        'creees': CotisationSerializer(creees, many=True).data,
        'participees': ParticipationSerializer(participees, many=True).data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rejoindre_cotisation(request, slug):
    cotisation = get_object_or_404(Cotisation, slug=slug, statut='active')

    if cotisation.createur == request.user:
        return Response(
            {'error': 'Le createur ne peut pas rejoindre sa propre cotisation'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if Participation.objects.filter(cotisation=cotisation, membre=request.user).exists():
        return Response({'error': 'Vous participez deja a cette cotisation'}, status=status.HTTP_400_BAD_REQUEST)

    if cotisation.nombre_membres_max:
        if cotisation.participations.count() >= cotisation.nombre_membres_max:
            return Response({'error': 'Cotisation complete'}, status=status.HTTP_400_BAD_REQUEST)

    participation = Participation.objects.create(
        cotisation=cotisation,
        membre=request.user,
        montant=cotisation.montant_par_membre
    )

    return Response(ParticipationSerializer(participation).data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def commentaires(request, slug):
    cotisation = get_object_or_404(Cotisation, slug=slug)

    try:
        participation = Participation.objects.get(cotisation=cotisation, membre=request.user)
    except Participation.DoesNotExist:
        return Response({'error': 'Vous ne participez pas a cette cotisation'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        comms = CommentaireCotisation.objects.filter(
            participation__cotisation=cotisation
        ).select_related('auteur')
        return Response(CommentaireSerializer(comms, many=True).data)

    # POST - ajouter un commentaire
    if not participation.commentaire_autorise():
        return Response({
            'error': 'Commentaire disponible 7 jours apres paiement confirme',
            'code': 'commentaire_non_autorise'
        }, status=status.HTTP_403_FORBIDDEN)

    serializer = CommentaireCreerSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    commentaire = serializer.save(participation=participation, auteur=request.user)
    return Response(CommentaireSerializer(commentaire).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def signaler_cotisation(request, slug):
    cotisation = get_object_or_404(Cotisation, slug=slug)

    if cotisation.createur == request.user:
        return Response({'error': 'Vous ne pouvez pas signaler votre propre cotisation'}, status=status.HTTP_400_BAD_REQUEST)

    if SignalementCotisation.objects.filter(cotisation=cotisation, signaleur=request.user).exists():
        return Response({'error': 'Vous avez deja signale cette cotisation'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = SignalementSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save(cotisation=cotisation, signaleur=request.user)

    # incrementer compteur et suspendre auto a 3 signalements
    cotisation.signalements += 1
    if cotisation.signalements >= 3:
        cotisation.statut = 'annulee'
    cotisation.save()

    return Response({'message': 'Signalement enregistre'}, status=status.HTTP_201_CREATED)