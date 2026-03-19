from django.utils import timezone
from django.conf import settings
from datetime import timedelta
from .models import VerificationToken, TokenTentative
import secrets
import string


def generer_token():
    # token 8 caracteres alphanumeriques
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(8))


def creer_token(utilisateur, canal, type_token):
    # invalider les anciens tokens du meme type
    VerificationToken.objects.filter(
        utilisateur=utilisateur,
        type_token=type_token,
        utilise=False
    ).update(utilise=True)

    expire_le = timezone.now() + timedelta(minutes=settings.TOKEN_EXPIRY_MINUTES)
    token = VerificationToken.objects.create(
        utilisateur=utilisateur,
        token=generer_token(),
        canal=canal,
        type_token=type_token,
        expire_le=expire_le
    )
    return token


def verifier_token(identifiant, token_str, type_token):
    # verifier blocage sur l'identifiant
    tentative, _ = TokenTentative.objects.get_or_create(
        identifiant=identifiant,
        type_token=type_token
    )

    if tentative.est_bloque():
        return None, 'bloque'

    try:
        token = VerificationToken.objects.get(
            token=token_str,
            type_token=type_token,
            utilise=False
        )
    except VerificationToken.DoesNotExist:
        # incrementer tentatives
        tentative.tentatives += 1
        if tentative.tentatives >= settings.TOKEN_MAX_ATTEMPTS:
            tentative.bloque_jusqu_au = timezone.now() + timedelta(hours=settings.TOKEN_BLOCK_HOURS)
        tentative.save()
        return None, 'invalide'

    if not token.est_valide():
        tentative.tentatives += 1
        if tentative.tentatives >= settings.TOKEN_MAX_ATTEMPTS:
            tentative.bloque_jusqu_au = timezone.now() + timedelta(hours=settings.TOKEN_BLOCK_HOURS)
        tentative.save()
        return None, 'expire'

    # token valide : marquer utilise et reset tentatives
    token.utilise = True
    token.save()
    tentative.tentatives = 0
    tentative.bloque_jusqu_au = None
    tentative.save()

    return token, 'ok'


def verifier_blocage_connexion(user):
    if user.est_bloque():
        return False, 'bloque'
    return True, 'ok'


def enregistrer_echec_connexion(user):
    user.tentatives_echec += 1

    if user.tentatives_echec >= 10:
        # blocage 24h + ticket alerte fraude
        user.bloque_jusqu_au = timezone.now() + timedelta(hours=24)
        _creer_alerte_fraude(user)
    elif user.tentatives_echec >= 5:
        # blocage 30 minutes
        user.bloque_jusqu_au = timezone.now() + timedelta(minutes=30)

    user.save()


def reset_echecs_connexion(user):
    user.tentatives_echec = 0
    user.bloque_jusqu_au = None
    user.save()


def _creer_alerte_fraude(user):
    from apps.logs.models import AlerteFraude
    AlerteFraude.objects.create(
        signaleur=user,
        signale=user,
        motif=f"10 echecs connexion consecutifs - possible tentative de force brute"
    )