from celery import shared_task
from core.logger import logger


@shared_task
def expirer_cotisations():
    from django.utils import timezone
    from .models import Cotisation

    expirees = Cotisation.objects.filter(
        statut='active',
        date_expiration__lte=timezone.now()
    )
    count = expirees.update(statut='expiree')
    if count:
        logger.info(f'{count} cotisations expirees')


@shared_task
def generer_pdf_participants(cotisation_id):
    from .models import Cotisation
    try:
        cotisation = Cotisation.objects.get(id=cotisation_id)
        logger.cotisation(
            'Generation PDF participants demandee',
            cotisation_id=str(cotisation_id)
        )
    except Exception as e:
        logger.error(f'Erreur generation PDF : {str(e)}')


@shared_task
def envoyer_rappel_non_payeurs(cotisation_id):
    from .models import Cotisation, Participation
    from notifications.utils import creer_notification

    try:
        cotisation = Cotisation.objects.get(id=cotisation_id, statut='active')
        non_payes = Participation.objects.filter(
            cotisation=cotisation,
            statut='en_attente',
        ).select_related('participant')

        for participation in non_payes:
            creer_notification(
                user=participation.participant,
                type_notification='rappel',
                titre=f'Rappel - {cotisation.nom}',
                message=f'Vous n\'avez pas encore paye votre cotisation pour "{cotisation.nom}". Montant : {cotisation.montant_unitaire} FCFA.',
                data={'cotisation_slug': cotisation.slug},
            )

        logger.cotisation(
            f'Rappels envoyes a {non_payes.count()} participants',
            cotisation_id=str(cotisation_id)
        )

    except Exception as e:
        logger.error(f'Erreur envoi rappels : {str(e)}')