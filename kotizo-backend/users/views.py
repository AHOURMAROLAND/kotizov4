from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from core.logger import logger
from core.decorators import log_action
from .serializers import (
    InscriptionSerializer, UserSerializer,
    UserProfilSerializer, VerificationIdentiteSerializer,
    DemandeBusinessSerializer,
)

User = get_user_model()


class InscriptionView(APIView):
    permission_classes = [AllowAny]

    @log_action('inscription')
    def post(self, request):
        serializer = InscriptionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        user.cgu_ip_acceptation = request.META.get('REMOTE_ADDR')
        user.save(update_fields=['cgu_ip_acceptation'])

        logger.auth('Nouvel utilisateur inscrit', user_id=str(user.id))

        from .tasks import envoyer_email_verification
        envoyer_email_verification.delay(str(user.id))

        return Response({
            'message': 'Compte cree. Verifiez votre email pour activer votre compte.',
            'email': user.email,
        }, status=status.HTTP_201_CREATED)


class VerifierEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            user = User.objects.get(
                token_verification_email=token,
                email_verifie=False
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'Lien invalide ou deja utilise'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.email_verifie = True
        user.token_verification_email = ''
        user.save(update_fields=['email_verifie', 'token_verification_email'])

        logger.auth('Email verifie', user_id=str(user.id))

        return Response({'message': 'Email verifie avec succes. Vous pouvez vous connecter.'})


class ConnexionView(APIView):
    permission_classes = [AllowAny]

    @log_action('connexion')
    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password', '')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Identifiants incorrects'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.check_password(password):
            logger.auth(
                'Tentative connexion echouee',
                ip=request.META.get('REMOTE_ADDR')
            )
            return Response(
                {'error': 'Identifiants incorrects'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.email_verifie:
            return Response(
                {'error': 'Veuillez verifier votre email avant de vous connecter'},
                status=status.HTTP_403_FORBIDDEN
            )

        if not user.is_active:
            return Response(
                {'error': 'Compte suspendu. Contactez le support.'},
                status=status.HTTP_403_FORBIDDEN
            )

        user.derniere_connexion_app = timezone.now()
        user.save(update_fields=['derniere_connexion_app'])

        refresh = RefreshToken.for_user(user)
        logger.auth('Connexion reussie', user_id=str(user.id))

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })


class DeconnexionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass
        return Response({'message': 'Deconnecte avec succes'})


class MoiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserProfilSerializer(
            request.user, data=request.data, partial=True
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class MotDePasseOublieView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        try:
            user = User.objects.get(email=email)
            from .tasks import envoyer_email_reset_password
            envoyer_email_reset_password.delay(str(user.id))
        except User.DoesNotExist:
            pass
        return Response({
            'message': 'Si cet email existe, un lien de reinitialisation a ete envoye.'
        })


class ReinitialisationMotDePasseView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        try:
            user = User.objects.get(token_verification_email=token)
        except User.DoesNotExist:
            return Response(
                {'error': 'Lien invalide ou expire'},
                status=status.HTTP_400_BAD_REQUEST
            )

        password = request.data.get('password', '')
        password_confirm = request.data.get('password_confirm', '')

        if len(password) < 8:
            return Response(
                {'error': 'Mot de passe trop court (minimum 8 caracteres)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if password != password_confirm:
            return Response(
                {'error': 'Les mots de passe ne correspondent pas'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.token_verification_email = ''
        user.save(update_fields=['password', 'token_verification_email'])

        logger.auth('Mot de passe reinitialise', user_id=str(user.id))

        return Response({'message': 'Mot de passe reinitialise avec succes.'})


class FCMTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        fcm_token = request.data.get('fcm_token', '')
        device_id = request.data.get('device_id', '')
        request.user.fcm_token = fcm_token
        request.user.device_id = device_id
        request.user.save(update_fields=['fcm_token', 'device_id'])
        return Response({'message': 'Token FCM mis a jour'})


class StatsProfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.core.cache import cache
        cache_key = f'stats_profil_{request.user.id}'
        data = cache.get(cache_key)

        if not data:
            from cotisations.models import Cotisation, Participation
            from paiements.models import Transaction

            total_collecte = Transaction.objects.filter(
                user=request.user,
                type_transaction='payin',
                statut='complete',
            ).aggregate(
                total=models.Sum('montant')
            )['total'] or 0

            data = {
                'total_collecte': total_collecte,
                'nb_cotisations_creees': Cotisation.objects.filter(
                    createur=request.user
                ).count(),
                'nb_participations': Participation.objects.filter(
                    participant=request.user,
                    statut='paye',
                ).count(),
                'nb_parrainages': request.user.nb_parrainages_actifs,
                'peut_verifie_ambassadeur': request.user.peut_obtenir_verifie_ambassadeur(),
                'peut_business_ambassadeur': request.user.peut_obtenir_business_ambassadeur(),
            }
            cache.set(cache_key, data, 3600)

        return Response(data)