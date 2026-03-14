from celery import shared_task
from core.logger import logger


@shared_task
def envoyer_email_verification(user_id):
    from django.contrib.auth import get_user_model
    from core.email_router import envoyer_email
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
        lien = f'https://api.kotizo.app/api/auth/verifier-email/{user.token_verification_email}/'
        corps = (
            f'Bonjour {user.prenom},\n\n'
            f'Cliquez sur ce lien pour verifier votre email :\n{lien}\n\n'
            f'Lien valable 24h.\n\nL\'equipe Kotizo'
        )
        envoyer_email(user.email, 'Verifiez votre adresse email - Kotizo', corps)
        logger.info('Email verification envoye', user_id=str(user.id))
    except Exception as e:
        logger.error(f'Erreur envoi email verification : {str(e)}')


@shared_task
def envoyer_email_reset_password(user_id):
    from django.contrib.auth import get_user_model
    from core.email_router import envoyer_email
    import secrets
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
        token = secrets.token_urlsafe(32)
        user.token_verification_email = token
        user.save(update_fields=['token_verification_email'])
        lien = f'https://kotizo.app/reset-password/{token}'
        corps = (
            f'Bonjour {user.prenom},\n\n'
            f'Cliquez sur ce lien pour reinitialiser votre mot de passe :\n{lien}\n\n'
            f'Lien valable 1h.\n\nL\'equipe Kotizo'
        )
        envoyer_email(user.email, 'Reinitialisation mot de passe - Kotizo', corps)
        logger.info('Email reset password envoye', user_id=str(user.id))
    except Exception as e:
        logger.error(f'Erreur envoi email reset password : {str(e)}')


@shared_task
def reset_compteurs_quotidiens():
    from django.contrib.auth import get_user_model
    from django.utils import timezone
    User = get_user_model()
    User.objects.all().update(
        cotisations_creees_aujourd_hui=0,
        date_reset_compteur=timezone.now().date()
    )
    logger.info('Compteurs quotidiens reinitialises')


@shared_task
def verifier_business_expires():
    from django.contrib.auth import get_user_model
    from django.utils import timezone
    from .models import DemandeBusinessLevel
    User = get_user_model()

    demandes_expirees = DemandeBusinessLevel.objects.filter(
        statut='approuve',
        paiement_effectue=False,
        date_expiration_gratuite__lte=timezone.now(),
    )

    for demande in demandes_expirees:
        demande.statut = 'expire'
        demande.save()
        demande.user.niveau = 'verifie'
        demande.user.save(update_fields=['niveau'])
        logger.info(
            f'Business expire -> retrograde verifie',
            user_id=str(demande.user.id)
        )


@shared_task
def verifier_seuils_ambassadeur():
    from django.contrib.auth import get_user_model
    User = get_user_model()

    for user in User.objects.filter(niveau='basique'):
        if user.peut_obtenir_verifie_ambassadeur():
            from notifications.utils import creer_notification
            creer_notification(
                user=user,
                type_notification='ambassadeur',
                titre='Vous pouvez obtenir le niveau Verifie gratuitement !',
                message='Vous avez atteint le seuil ambassadeur. Rendez-vous dans Profil > Verification.',
            )
            logger.ambassadeur(
                'Seuil verifie ambassadeur atteint',
                user_id=str(user.id)
            )

    for user in User.objects.filter(niveau='verifie'):
        if user.peut_obtenir_business_ambassadeur():
            from notifications.utils import creer_notification
            creer_notification(
                user=user,
                type_notification='ambassadeur',
                titre='Vous pouvez obtenir le niveau Business gratuitement !',
                message='Vous avez atteint le seuil ambassadeur Business. Faites votre demande dans Profil.',
            )
            logger.ambassadeur(
                'Seuil business ambassadeur atteint',
                user_id=str(user.id)
            )