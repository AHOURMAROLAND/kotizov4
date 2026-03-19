from django.db import models
from django.conf import settings


class StateLog(models.Model):
    utilisateur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100)
    details = models.JSONField(default=dict)
    ip = models.GenericIPAddressField(null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'state_logs'
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.action} - {self.date_creation}"


class AlerteFraude(models.Model):
    STATUT_CHOICES = [
        ('ouverte', 'Ouverte'),
        ('traitee', 'Traitee'),
        ('fermee', 'Fermee'),
    ]

    signaleur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='alertes_emises')
    signale = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='alertes_recues')
    motif = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='ouverte')
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'alertes_fraude'

    def __str__(self):
        return f"Alerte {self.signaleur} → {self.signale}"


class Sanction(models.Model):
    TYPE_CHOICES = [
        ('avertissement', 'Avertissement'),
        ('suspension', 'Suspension'),
        ('bannissement', 'Bannissement'),
    ]

    utilisateur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sanctions')
    type_sanction = models.CharField(max_length=20, choices=TYPE_CHOICES)
    motif = models.TextField()
    date_debut = models.DateTimeField(auto_now_add=True)
    date_fin = models.DateTimeField(null=True, blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        db_table = 'sanctions'

    def __str__(self):
        return f"{self.type_sanction} - {self.utilisateur}"