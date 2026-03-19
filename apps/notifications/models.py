from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPE_CHOICES = [
        ('paiement', 'Paiement'),
        ('rappel', 'Rappel'),
        ('systeme', 'Systeme'),
        ('recu', 'Recu'),
        ('commentaire', 'Commentaire'),
    ]

    CANAL_CHOICES = [
        ('inapp', 'In-App'),
        ('whatsapp', 'WhatsApp'),
        ('email', 'Email'),
        ('push', 'Push'),
    ]

    destinataire = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type_notification = models.CharField(max_length=20, choices=TYPE_CHOICES)
    canal = models.CharField(max_length=20, choices=CANAL_CHOICES, default='inapp')
    titre = models.CharField(max_length=200)
    contenu = models.TextField()
    lu = models.BooleanField(default=False)
    envoye = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_lecture = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.type_notification} → {self.destinataire}"


class DeviceToken(models.Model):
    PLATEFORME_CHOICES = [
        ('ios', 'iOS'),
        ('android', 'Android'),
    ]

    utilisateur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='device_tokens')
    token = models.TextField(unique=True)
    plateforme = models.CharField(max_length=10, choices=PLATEFORME_CHOICES)
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'device_tokens'

    def __str__(self):
        return f"{self.utilisateur} - {self.plateforme}"