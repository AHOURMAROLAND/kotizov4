from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import StateLog
from .serializers import StateLogSerializer

# evenements valides par categorie
EVENEMENTS_VALIDES = {
    # auth
    'AUTH_INSCRIPTION', 'AUTH_CONNEXION', 'AUTH_DECONNEXION',
    'AUTH_ECHEC_CONNEXION', 'AUTH_BLOCAGE', 'AUTH_VERIFICATION_EMAIL',
    'AUTH_VERIFICATION_WA', 'AUTH_RESET_PASSWORD', 'AUTH_BIOMETRIE_ACTIVEE',
    'AUTH_CONNEXION_MAGIQUE',
    # cotisations
    'COTISATION_CREEE', 'COTISATION_REJOINTE', 'COTISATION_PAIEMENT_INITIE',
    'COTISATION_PAIEMENT_CONFIRME', 'COTISATION_SIGNALEE', 'COTISATION_ANNULEE',
    'COTISATION_COMMENTAIRE',
    # quickpay
    'QUICKPAY_CREE', 'QUICKPAY_PAYE', 'QUICKPAY_EXPIRE',
    # ia
    'IA_MESSAGE_ENVOYE', 'IA_LIMITE_ATTEINTE', 'IA_INJECTION_DETECTEE', 'IA_BLACKLIST',
    # navigation
    'NAV_ECRAN', 'NAV_ONBOARDING_COMPLETE',
    # profil
    'PROFIL_MODIFIE', 'PROFIL_PHOTO_MODIFIEE', 'PROFIL_EMAIL_MODIFIE',
    'PROFIL_WA_MODIFIE', 'PROFIL_SUPPRESSION_DEMANDEE',
    # securite
    'SESSIONS_LISTE_VUE', 'SESSIONS_DECONNEXION_PARTOUT',
    # erreurs
    'ERREUR_RESEAU', 'ERREUR_PAIEMENT', 'ERREUR_IA',
}


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enregistrer_log(request):
    serializer = StateLogSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    event = serializer.validated_data['event']

    # valider l'evenement
    if event not in EVENEMENTS_VALIDES:
        return Response({'error': f'Evenement non reconnu : {event}'}, status=status.HTTP_400_BAD_REQUEST)

    # recuperer IP
    ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))
    if ',' in ip:
        ip = ip.split(',')[0].strip()

    StateLog.objects.create(
        utilisateur=request.user,
        action=event,
        details={
            **serializer.validated_data.get('details', {}),
            'plateforme': serializer.validated_data.get('plateforme', ''),
            'version_app': serializer.validated_data.get('version_app', ''),
        },
        ip=ip
    )

    return Response({'status': 'ok'}, status=status.HTTP_201_CREATED)