from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone

from .serializers import (
    InscriptionSerializer, ConnexionSerializer, UserSerializer,
    ChangerMotDePasseSerializer, ResetPasswordDemandeSerializer,
    ResetPasswordConfirmSerializer
)
from .services import (
    creer_token, verifier_token, verifier_blocage_connexion,
    enregistrer_echec_connexion, reset_echecs_connexion
)
from apps.core.email_router import envoyer_email, template_verification, template_reset_password, template_alerte_securite
from apps.core.whatsapp import envoyer_otp, envoyer_alerte_securite

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def inscription(request):
    serializer = InscriptionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()

    # creer tokens de verification pour les deux canaux
    token_email = creer_token(user, 'email', 'inscription')
    token_wa = None
    if user.telephone_whatsapp:
        token_wa = creer_token(user, 'whatsapp', 'inscription')

    envoyer_email(
        user.email,
        'Verifiez votre compte Kotizo',
        template_verification(user.prenom, token_email.token)
    )
    if token_wa and user.telephone_whatsapp:
        envoyer_otp(user.telephone_whatsapp, user.prenom, token_wa.token, 'verification')

    return Response({
        'message': 'Compte cree. Verifiez votre email ou WhatsApp.',
        'user_id': user.id,
        'canaux': {
            'email': True,
            'whatsapp': bool(user.telephone_whatsapp)
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def confirmer_email(request):
    token_str = request.data.get('token')
    email = request.data.get('email')

    if not token_str or not email:
        return Response({'error': 'Token et email requis'}, status=status.HTTP_400_BAD_REQUEST)

    token, resultat = verifier_token(email, token_str, 'inscription')

    if resultat == 'bloque':
        return Response({'error': 'Trop de tentatives. Reessayez plus tard.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    if resultat in ['invalide', 'expire']:
        return Response({'error': 'Token invalide ou expire'}, status=status.HTTP_400_BAD_REQUEST)

    user = token.utilisateur
    user.email_verifie = True
    if not user.date_verification:
        user.date_verification = timezone.now()
    user.save()

    return Response({'message': 'Email verifie avec succes'})


@api_view(['POST'])
@permission_classes([AllowAny])
def confirmer_whatsapp(request):
    token_str = request.data.get('token')
    telephone = request.data.get('telephone')

    if not token_str or not telephone:
        return Response({'error': 'Token et telephone requis'}, status=status.HTTP_400_BAD_REQUEST)

    token, resultat = verifier_token(telephone, token_str, 'inscription')

    if resultat == 'bloque':
        return Response({'error': 'Trop de tentatives. Reessayez plus tard.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    if resultat in ['invalide', 'expire']:
        return Response({'error': 'Token invalide ou expire'}, status=status.HTTP_400_BAD_REQUEST)

    user = token.utilisateur
    user.whatsapp_verifie = True
    if not user.date_verification:
        user.date_verification = timezone.now()
    user.save()

    return Response({'message': 'WhatsApp verifie avec succes'})


@api_view(['POST'])
@permission_classes([AllowAny])
def connexion(request):
    serializer = ConnexionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Identifiants incorrects'}, status=status.HTTP_401_UNAUTHORIZED)

    # verifier blocage
    ok, raison = verifier_blocage_connexion(user)
    if not ok:
        return Response({'error': 'Compte temporairement bloque', 'code': 'bloque'}, status=status.HTTP_403_FORBIDDEN)

    # verifier mot de passe
    if not user.check_password(password):
        enregistrer_echec_connexion(user)
        return Response({'error': 'Identifiants incorrects'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.est_verifie():
        return Response({'error': 'Compte non verifie', 'code': 'non_verifie'}, status=status.HTTP_403_FORBIDDEN)

    # connexion reussie
    reset_echecs_connexion(user)
    refresh = RefreshToken.for_user(user)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deconnexion(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Deconnecte avec succes'})
    except Exception:
        return Response({'error': 'Token invalide'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profil(request):
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def changer_mot_de_passe(request):
    serializer = ChangerMotDePasseSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    if not user.check_password(serializer.validated_data['ancien_password']):
        return Response({'error': 'Mot de passe actuel incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(serializer.validated_data['nouveau_password'])
    user.save()

    # blacklister tous les refresh tokens actifs
    OutstandingToken.objects.filter(user=user).update(blacklistedtoken=None)
    for token in OutstandingToken.objects.filter(user=user):
        BlacklistedToken.objects.get_or_create(token=token)

    if user.telephone_whatsapp:
        envoyer_alerte_securite(user.telephone_whatsapp, user.prenom, 'changement_mot_de_passe')
    envoyer_email(
        user.email,
        'Alerte securite Kotizo',
        template_alerte_securite(user.prenom, 'changement_mot_de_passe')
    )

    return Response({'message': 'Mot de passe modifie. Reconnectez-vous.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_demande(request):
    serializer = ResetPasswordDemandeSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    canal = serializer.validated_data['canal']

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # reponse identique pour ne pas reveler si l'email existe
        return Response({'message': 'Si ce compte existe, un code a ete envoye.'})

    # canal whatsapp : verifier que le numero existe
    if canal == 'whatsapp' and not user.telephone_whatsapp:
        canal = 'email'

    token = creer_token(user, canal, 'reset_password')

    if canal == 'whatsapp':
        envoyer_otp(user.telephone_whatsapp, user.prenom, token.token, 'reset_password')
    else:
        envoyer_email(
            user.email,
            'Reinitialisation de mot de passe Kotizo',
            template_reset_password(user.prenom, token.token)
        )

    return Response({
        'message': 'Si ce compte existe, un code a ete envoye.',
        'canal': canal
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirmer(request):
    serializer = ResetPasswordConfirmSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    token_str = serializer.validated_data['token']

    token, resultat = verifier_token(email, token_str, 'reset_password')

    if resultat == 'bloque':
        return Response({'error': 'Trop de tentatives. Reessayez plus tard.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    if resultat in ['invalide', 'expire']:
        return Response({'error': 'Code invalide ou expire'}, status=status.HTTP_400_BAD_REQUEST)

    user = token.utilisateur
    user.set_password(serializer.validated_data['nouveau_password'])
    user.save()

    # blacklister tous les refresh tokens
    for t in OutstandingToken.objects.filter(user=user):
        BlacklistedToken.objects.get_or_create(token=t)

    if user.telephone_whatsapp:
        envoyer_alerte_securite(user.telephone_whatsapp, user.prenom, 'reset_password')
    envoyer_email(
        user.email,
        'Alerte securite Kotizo',
        template_alerte_securite(user.prenom, 'reset_password')
    )

    return Response({'message': 'Mot de passe reinitialise avec succes'})