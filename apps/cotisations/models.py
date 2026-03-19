from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import random
import string


def generer_slug():
    chars = string.ascii_uppercase + string.digits
    return 'KTZ-' + ''.join(random.choices(chars, k=6))


class Cotisation(models.Model):
    STATUT_CHOICES = [
        ('active', 'Active'),
        ('terminee', 'Terminee'),
        ('annulee', 'Annulee'),
    ]

    createur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cotisations_creees'
    )
    slug = models.CharField(max_length=10, unique=True)
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    montant_cible = models.DecimalField(max_digits=12, decimal_places=2)
    montant_par_membre = models.DecimalField(max_digits=12, decimal_places=2)
    nombre_membres_max = models.IntegerField(null=True, blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='active')
    signalements = models.IntegerField(default=0)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_limite = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'cotisations'
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.slug} - {self.titre}"

    def save(self, *args, **kwargs):
        # generer un slug unique a la creation
        if not self.slug:
            slug = generer_slug()
            while Cotisation.objects.filter(slug=slug).exists():
                slug = generer_slug()
            self.slug = slug
        super().save(*args, **kwargs)

    def montant_collecte(self):
        return self.participations.filter(statut='payee').aggregate(
            total=models.Sum('montant')
        )['total'] or 0


class Participation(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('payee', 'Payee'),
        ('en_retard', 'En retard'),
        ('remboursee', 'Remboursee'),
    ]

    cotisation = models.ForeignKey(
        Cotisation,
        on_delete=models.CASCADE,
        related_name='participations'
    )
    membre = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='participations'
    )
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    date_paiement = models.DateTimeField(null=True, blank=True)
    recu_url = models.URLField(blank=True, null=True)
    recu_envoye_wa = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'participations'
        unique_together = ['cotisation', 'membre']

    def __str__(self):
        return f"{self.membre} - {self.cotisation.slug}"

    def commentaire_autorise(self):
        if self.statut != 'payee' or not self.date_paiement:
            return False
        delai = timedelta(days=settings.COMMENT_UNLOCK_DAYS)
        return timezone.now() >= self.date_paiement + delai


class CommentaireCotisation(models.Model):
    participation = models.ForeignKey(
        Participation,
        on_delete=models.CASCADE,
        related_name='commentaires'
    )
    auteur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='commentaires'
    )
    contenu = models.TextField(max_length=500)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'commentaires_cotisation'
        ordering = ['-date_creation']

    def __str__(self):
        return f"Commentaire de {self.auteur} sur {self.participation}"


class SignalementCotisation(models.Model):
    cotisation = models.ForeignKey(
        Cotisation,
        on_delete=models.CASCADE,
        related_name='signalements_detail'
    )
    signaleur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='signalements_emis'
    )
    motif = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'signalements_cotisation'
        unique_together = ['cotisation', 'signaleur']

    def __str__(self):
        return f"Signalement {self.signaleur} -> {self.cotisation.slug}"