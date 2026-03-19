from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import Transaction, QuickPay, DemandeRemboursement, SEUIL_REMBOURSEMENT_AUTO
from .serializers import (
    TransactionSerializer, InitierPaiementSerializer,
    QuickPayCreerSerializer, QuickPaySerializer,
    DemandeRemboursementSerializer
)
from .paydunya import verifier_hash_webhook, initier_paiement_mobile
from apps.cotisations.models import Participation


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initier_paiement(request):
    serializer = InitierPaiementSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    participation = get_object_or_404(
        Participation,
        id=serializer.validated_data['participation_id'],
        membre=request.user,
        statut='en_attente'
    )

    telephone = serializer.validated_data['telephone']
    operateur = serializer.validated_data['operateur']

    # creer la transaction
    transaction = Transaction.objects.create(
        utilisateur=request.user,
        type_transaction='cotisation',
        montant=participation.montant,
        operateur=operateur,
        telephone=telephone,
        metadata={'participation_id': participation.id}
    )

    # appel PayDunya
    resultat = initier_paiement_mobile(
        montant=participation.montant,
        telephone=telephone,
        operateur=operateur,
        description=f"Cotisation {participation.cotisation.titre}",
        reference_interne=str(transaction.id)
    )

    if not resultat['succes']:
        transaction.statut = 'failed'
        transaction.save()
        return Response({'error': resultat['erreur']}, status=status.HTTP_400_BAD_REQUEST)

    transaction.reference_paydunya = resultat.get('token')
    transaction.save()

    return Response({
        'transaction_id': transaction.id,
        'statut': 'pending',
        'message': 'Paiement initie. Confirmez sur votre telephone.'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def webhook_ipn(request):
    # IPN PayDunya - request.POST obligatoire, jamais json.loads
    if not verifier_hash_webhook(request.POST):
        return Response({'error': 'Hash invalide'}, status=status.HTTP_400_BAD_REQUEST)

    token = request.POST.get('token')
    statut_recu = request.POST.get('status')

    try:
        transaction = Transaction.objects.get(reference_paydunya=token)
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction introuvable'}, status=status.HTTP_404_NOT_FOUND)

    if statut_recu == 'completed':
        transaction.statut = 'success'
        transaction.save()

        # mettre a jour la participation
        if transaction.type_transaction == 'cotisation':
            participation_id = transaction.metadata.get('participation_id')
            if participation_id:
                try:
                    participation = Participation.objects.get(id=participation_id)
                    participation.statut = 'payee'
                    participation.date_paiement = timezone.now()
                    participation.save()

                    # generer et envoyer le recu
                    _traiter_recu(participation)
                except Participation.DoesNotExist:
                    pass

        elif transaction.type_transaction == 'quickpay':
            quickpay_id = transaction.metadata.get('quickpay_id')
            if quickpay_id:
                try:
                    qp = QuickPay.objects.get(id=quickpay_id)
                    qp.statut = 'paye'
                    qp.save()
                except QuickPay.DoesNotExist:
                    pass

    elif statut_recu == 'failed':
        transaction.statut = 'failed'
        transaction.save()

    return Response({'status': 'ok'})


def _traiter_recu(participation):
    # generer recu JPG et envoyer par WhatsApp
    try:
        from .recu import uploader_recu_cloudinary
        from apps.core.whatsapp import envoyer_recu

        url = uploader_recu_cloudinary(participation)
        participation.recu_url = url
        participation.save()

        if participation.membre.telephone_whatsapp:
            envoyer_recu(
                participation.membre.telephone_whatsapp,
                participation.membre.prenom,
                participation.cotisation.titre,
                participation.montant,
                url
            )
            participation.recu_envoye_wa = True
            participation.save()
    except Exception:
        pass


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creer_quickpay(request):
    serializer = QuickPayCreerSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    from django.contrib.auth import get_user_model
    User = get_user_model()

    destinataire = get_object_or_404(User, id=serializer.validated_data['destinataire_id'])

    if destinataire == request.user:
        return Response({'error': 'Vous ne pouvez pas vous envoyer un QuickPay'}, status=status.HTTP_400_BAD_REQUEST)

    transaction = Transaction.objects.create(
        utilisateur=request.user,
        type_transaction='quickpay',
        montant=serializer.validated_data['montant'],
        telephone=request.user.telephone_whatsapp or '',
    )

    qp = QuickPay.objects.create(
        expediteur=request.user,
        destinataire=destinataire,
        montant=serializer.validated_data['montant'],
        transaction=transaction,
        message=serializer.validated_data.get('message', '')
    )

    transaction.metadata = {'quickpay_id': qp.id}
    transaction.save()

    return Response(QuickPaySerializer(qp).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mes_quickpay(request):
    envoyes = QuickPay.objects.filter(expediteur=request.user).select_related('destinataire')
    recus = QuickPay.objects.filter(destinataire=request.user).select_related('expediteur')

    return Response({
        'envoyes': QuickPaySerializer(envoyes, many=True).data,
        'recus': QuickPaySerializer(recus, many=True).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def demander_remboursement(request, transaction_id):
    transaction = get_object_or_404(
        Transaction,
        id=transaction_id,
        utilisateur=request.user,
        statut='success'
    )

    if DemandeRemboursement.objects.filter(transaction=transaction).exists():
        return Response({'error': 'Une demande existe deja pour cette transaction'}, status=status.HTTP_400_BAD_REQUEST)

    motif = request.data.get('motif', '')
    if not motif:
        return Response({'error': 'Motif obligatoire'}, status=status.HTTP_400_BAD_REQUEST)

    # auto si < 2000 FCFA
    traitement_auto = transaction.montant < SEUIL_REMBOURSEMENT_AUTO

    demande = DemandeRemboursement.objects.create(
        transaction=transaction,
        demandeur=request.user,
        motif=motif,
        traitement_auto=traitement_auto
    )

    if traitement_auto:
        # traitement immediat
        demande.statut = 'approuvee'
        demande.date_traitement = timezone.now()
        demande.save()
        transaction.statut = 'refunded'
        transaction.save()

    return Response(DemandeRemboursementSerializer(demande).data, status=status.HTTP_201_CREATED)