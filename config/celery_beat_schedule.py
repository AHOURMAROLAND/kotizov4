from celery.schedules import crontab

CELERYBEAT_SCHEDULE = {
    # suppression comptes non verifies toutes les heures
    'supprimer-comptes-non-verifies': {
        'task': 'config.celery_tasks.supprimer_comptes_non_verifies',
        'schedule': crontab(minute=0),
    },
    # expiration quickpay toutes les 5 minutes
    'expirer-quickpay': {
        'task': 'config.celery_tasks.expirer_quickpay',
        'schedule': crontab(minute='*/5'),
    },
    # expiration cotisations toutes les heures
    'expirer-cotisations': {
        'task': 'config.celery_tasks.expirer_cotisations',
        'schedule': crontab(minute=30),
    },
    # ping WhatsApp toutes les 5 minutes
    'ping-whatsapp': {
        'task': 'config.celery_tasks.ping_whatsapp',
        'schedule': crontab(minute='*/5'),
    },
    # reset compteurs IA a minuit heure de Lome
    'reset-compteurs-ia': {
        'task': 'config.celery_tasks.reset_compteurs_ia',
        'schedule': crontab(hour=0, minute=0),
    },
    # rapport journalier 20h heure de Lome
    'rapport-journalier': {
        'task': 'config.celery_tasks.rapport_journalier',
        'schedule': crontab(hour=20, minute=0),
    },
}