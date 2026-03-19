from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.cache import cache

from apps.users.models import VerificationToken
from apps.cotisations.models import Cotisation
from apps.paiements.models import Transaction, DemandeRemboursement
from apps.logs.models import AlerteFraude, Sanction
from apps.notifications.models import Notification

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard(request):
    from datetime import timedelta
    hier = timezone.now() - timedelta(hours=24)

    return Response({
        'utilisateurs_total': User.objects.filter(is_active=True).count(),
        'utilisateurs_verifies': User.objects.filter(niveau='verified').count(),
        'cotisations_actives': Cotisation.objects.filter(statut='active').count(),
        'transactions_24h': Transaction.objects.filter(date_creation__gte=hier, statut='success').count(),
        'alertes_fraude_ouvertes': AlerteFraude.objects.filter(statut='ouverte').count(),
        'remboursements_en_attente': DemandeRemboursement.objects.filter(statut='en_attente').count(),
        'whatsapp_disponible': cache.get('wa_disponible', True),
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def liste_utilisateurs(request):
    niveau = request.query_params.get('niveau')
    users = User.objects.all().order_by('-date_creation')
    if niveau:
        users = users.filter(niveau=niveau)

    data = [{
        'id': u.id,
        'email': u.email,
        'nom': u.nom,
        'prenom': u.prenom,
        'niveau': u.niveau,
        'email_verifie': u.email_verifie,
        'whatsapp_verifie': u.whatsapp_verifie,
        'date_creation': u.date_creation,
        'est_bloque': u.est_bloque(),
    } for u in users]

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def valider_verification(request, user_id):
    # valider la verification CNI d'un utilisateur
    try:
        user = User.objects.get(id=user_id, niveau='basic')
    except User.DoesNotExist:
        return Response({'error': 'Utilisateur introuvable ou deja verifie'}, status=status.HTTP_404_NOT_FOUND)

    user.niveau = 'verified'
    user.date_verification = timezone.now()
    user.save()

    # notifier l'utilisateur
    Notification.objects.create(
        destinataire=user,
        type_notification='systeme',
        canal='inapp',
        titre='Compte verifie',
        contenu='Votre compte a ete verifie. Vous pouvez maintenant payer les 1000 FCFA pour activer votre niveau Verifie.'
    )

    return Response({'message': f'Utilisateur {user.email} verifie avec succes'})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def rejeter_verification(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Utilisateur introuvable'}, status=status.HTTP_404_NOT_FOUND)

    motif = request.data.get('motif', 'Documents non conformes')

    Notification.objects.create(
        destinataire=user,
        type_notification='systeme',
        canal='inapp',
        titre='Verification rejetee',
        contenu=f'Votre demande de verification a ete rejetee. Motif : {motif}'
    )

    return Response({'message': 'Verification rejetee'})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def liste_alertes_fraude(request):
    alertes = AlerteFraude.objects.filter(
        statut='ouverte'
    ).select_related('signaleur', 'signale').order_by('-date_creation')

    data = [{
        'id': a.id,
        'signaleur': a.signaleur.email,
        'signale': a.signale.email,
        'motif': a.motif,
        'date_creation': a.date_creation,
    } for a in alertes]

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def sanctionner_utilisateur(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Utilisateur introuvable'}, status=status.HTTP_404_NOT_FOUND)

    type_sanction = request.data.get('type_sanction', 'avertissement')
    motif = request.data.get('motif', '')
    date_fin = request.data.get('date_fin')

    if not motif:
        return Response({'error': 'Motif obligatoire'}, status=status.HTTP_400_BAD_REQUEST)

    sanction = Sanction.objects.create(
        utilisateur=user,
        type_sanction=type_sanction,
        motif=motif,
        date_fin=date_fin
    )

    if type_sanction == 'bannissement':
        user.is_active = False
        user.save()

    Notification.objects.create(
        destinataire=user,
        type_notification='systeme',
        canal='inapp',
        titre='Sanction appliquee',
        contenu=f'Une sanction a ete appliquee sur votre compte. Motif : {motif}'
    )

    return Response({'message': f'Sanction {type_sanction} appliquee', 'sanction_id': sanction.id})


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def config_whatsapp(request):
    # AW14 - configuration WhatsApp sans toucher au code
    if request.method == 'GET':
        return Response({
            'instance': cache.get('wa_instance', ''),
            'api_url': cache.get('wa_api_url', ''),
            'statut': 'connecte' if cache.get('wa_disponible', True) else 'deconnecte',
            'echecs_consecutifs': cache.get('wa_echecs_consecutifs', 0),
        })

    # POST - mettre a jour la config WhatsApp a chaud
    instance = request.data.get('instance')
    api_url = request.data.get('api_url')
    api_key = request.data.get('api_key')

    if instance:
        cache.set('wa_instance', instance, timeout=None)
    if api_url:
        cache.set('wa_api_url', api_url, timeout=None)
    if api_key:
        cache.set('wa_api_key', api_key, timeout=None)

    return Response({'message': 'Configuration WhatsApp mise a jour'})


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def config_generale(request):
    # AW15 - parametres generaux modifiables sans deploiement
    if request.method == 'GET':
        return Response({
            'cotisation_limite_basic': cache.get('cotisation_limite_basic', 5),
            'cotisation_limite_verified': cache.get('cotisation_limite_verified', 20),
            'ia_limite_basic': cache.get('ia_limite_basic', 3),
            'ia_limite_verified': cache.get('ia_limite_verified', 25),
            'token_expiry_minutes': cache.get('token_expiry_minutes', 5),
            'token_block_hours': cache.get('token_block_hours', 12),
            'seuil_remboursement_auto': cache.get('seuil_remboursement_auto', 2000),
        })

    # POST - mettre a jour les parametres
    champs = [
        'cotisation_limite_basic', 'cotisation_limite_verified',
        'ia_limite_basic', 'ia_limite_verified',
        'token_expiry_minutes', 'token_block_hours',
        'seuil_remboursement_auto'
    ]

    for champ in champs:
        valeur = request.data.get(champ)
        if valeur is not None:
            cache.set(champ, int(valeur), timeout=None)

    return Response({'message': 'Configuration mise a jour'})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def remboursements_en_attente(request):
    demandes = DemandeRemboursement.objects.filter(
        statut='en_attente',
        traitement_auto=False
    ).select_related('transaction', 'demandeur').order_by('-date_creation')

    data = [{
        'id': d.id,
        'demandeur': d.demandeur.email,
        'montant': str(d.transaction.montant),
        'motif': d.motif,
        'date_creation': d.date_creation,
    } for d in demandes]

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def traiter_remboursement(request, demande_id):
    try:
        demande = DemandeRemboursement.objects.get(id=demande_id, statut='en_attente')
    except DemandeRemboursement.DoesNotExist:
        return Response({'error': 'Demande introuvable'}, status=status.HTTP_404_NOT_FOUND)

    decision = request.data.get('decision')
    if decision not in ['approuver', 'refuser']:
        return Response({'error': 'Decision invalide'}, status=status.HTTP_400_BAD_REQUEST)

    if decision == 'approuver':
        demande.statut = 'approuvee'
        demande.transaction.statut = 'refunded'
        demande.transaction.save()
    else:
        demande.statut = 'refusee'

    demande.traite_par = request.user
    demande.date_traitement = timezone.now()
    demande.save()

    return Response({'message': f'Remboursement {demande.statut}'})