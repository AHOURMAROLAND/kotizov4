from celery import shared_task
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
import pytz


@shared_task
def supprimer_comptes_non_verifies():
    # supprime les comptes non verifies apres 48h
    from apps.users.models import User
    limite = timezone.now() - timedelta(hours=settings.UNVERIFIED_ACCOUNT_DELETE_HOURS)
    supprimes = User.objects.filter(
        email_verifie=False,
        whatsapp_verifie=False,
        date_creation__lt=limite
    ).delete()
    return f"{supprimes[0]} comptes supprimes"


@shared_task
def expirer_quickpay():
    # expire les quickpay non payes apres 1h
    from apps.paiements.models import QuickPay
    expires = QuickPay.objects.filter(
        statut='en_attente',
        expire_le__lt=timezone.now()
    ).update(statut='expire')
    return f"{expires} quickpay expires"


@shared_task
def expirer_cotisations():
    # expire les cotisations dont la date limite est depassee
    from apps.cotisations.models import Cotisation
    expires = Cotisation.objects.filter(
        statut='active',
        date_limite__lt=timezone.now()
    ).update(statut='terminee')
    return f"{expires} cotisations terminees"


@shared_task
def ping_whatsapp():
    # ping Evolution API toutes les 5 min
    # 3 echecs consecutifs = panne confirmee
    from apps.core.whatsapp import verifier_statut
    from django.core.cache import cache

    statut = verifier_statut()

    if statut:
        cache.set('wa_echecs_consecutifs', 0, timeout=3600)
        cache.set('wa_disponible', True, timeout=3600)
    else:
        echecs = cache.get('wa_echecs_consecutifs', 0) + 1
        cache.set('wa_echecs_consecutifs', echecs, timeout=3600)

        if echecs >= 3:
            cache.set('wa_disponible', False, timeout=3600)
            _notifier_panne_whatsapp()

    return f"WhatsApp statut: {'ok' if statut else 'erreur'}"


def _notifier_panne_whatsapp():
    # envoyer email admin + notification in-app a tous les users actifs
    from apps.core.email_router import envoyer_email
    from apps.notifications.models import Notification
    from apps.users.models import User
    import os

    admin_email = os.getenv('GMAIL_USER', '')
    if admin_email:
        envoyer_email(
            admin_email,
            'ALERTE : WhatsApp Kotizo indisponible',
            '<p>Evolution API ne repond plus depuis 3 tentatives consecutives.</p>'
        )

    # notifier tous les utilisateurs actifs
    users_actifs = User.objects.filter(is_active=True, email_verifie=True)
    notifications = [
        Notification(
            destinataire=user,
            type_notification='systeme',
            canal='inapp',
            titre='WhatsApp temporairement indisponible',
            contenu='Les notifications WhatsApp sont momentanement suspendues. Nous vous informerons du retablissement.'
        )
        for user in users_actifs
    ]
    Notification.objects.bulk_create(notifications, ignore_conflicts=True)


@shared_task
def notifier_retablissement_whatsapp():
    # envoyer notif de retablissement et demander confirmation aux users
    from apps.notifications.models import Notification
    from apps.users.models import User

    users = User.objects.filter(is_active=True, whatsapp_verifie=True)
    notifications = [
        Notification(
            destinataire=user,
            type_notification='systeme',
            canal='inapp',
            titre='WhatsApp retabli',
            contenu='Les notifications WhatsApp sont de nouveau disponibles. Cliquez pour confirmer la reception.'
        )
        for user in users
    ]
    Notification.objects.bulk_create(notifications, ignore_conflicts=True)
    return f"{len(notifications)} notifications envoyees"


@shared_task
def reset_compteurs_ia():
    # reset compteurs IA a minuit heure de Lome
    from django.core.cache import cache
    from apps.users.models import User

    users = User.objects.filter(is_active=True).values_list('id', flat=True)
    for user_id in users:
        cache.delete(f'ia_count_{user_id}')
    return f"Compteurs IA remis a zero pour {len(users)} utilisateurs"


@shared_task
def rapport_journalier():
    # rapport journalier 20h heure de Lome - uniquement si activite dans les 24h
    from apps.cotisations.models import Cotisation, Participation
    from apps.paiements.models import Transaction
    from apps.core.whatsapp import envoyer_message
    import os

    hier = timezone.now() - timedelta(hours=24)

    nouvelles_cotisations = Cotisation.objects.filter(date_creation__gte=hier).count()
    paiements_confirmes = Transaction.objects.filter(
        statut='success',
        date_creation__gte=hier
    ).count()

    # envoyer seulement si activite
    if nouvelles_cotisations == 0 and paiements_confirmes == 0:
        return "Pas d'activite - rapport non envoye"

    admin_wa = os.getenv('ADMIN_WHATSAPP', '')
    if admin_wa:
        message = (
            f"Rapport Kotizo du jour\n\n"
            f"Nouvelles cotisations : {nouvelles_cotisations}\n"
            f"Paiements confirmes : {paiements_confirmes}\n"
        )
        envoyer_message(admin_wa, message)

    return f"Rapport envoye - {nouvelles_cotisations} cotisations, {paiements_confirmes} paiements"