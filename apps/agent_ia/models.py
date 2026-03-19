from django.db import models
from django.conf import settings


class MessageIA(models.Model):
    ROLE_CHOICES = [
        ('user', 'Utilisateur'),
        ('assistant', 'Assistant'),
    ]

    utilisateur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='messages_ia')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    contenu = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages_ia'
        ordering = ['date_creation']

    def __str__(self):
        return f"{self.role} - {self.utilisateur}"