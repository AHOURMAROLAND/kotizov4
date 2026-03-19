from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

SEUIL_REMBOURSEMENT_AUTO = 2000


class Transaction(models.Model):
    STATUT_CHOICES = [
        ('pending', 'En attente'),
        ('success', 'Succes'),
        ('failed', 'Echec'),
        ('refunded', 'Rembourse'),
    ]

    TYPE_CHOICES = [
        ('cotisation', 'Cotisation'),
        ('quickpay', 'QuickPay'),
        ('remboursement', 'Remboursement'),
        ('verification', 'Verification niveau'),
    ]

    OPERATEUR_CHOICES = [
        ('mixx', 'Mixx by Yas'),
        ('moov', 'Moov Money'),
        ('tmoney', 'T-Money'),
    ]

    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    type_transaction = models.CharField(max_length=20, choices=TYPE_CHOICES)
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    operateur = models.CharField(max_length=20, choices=OPERATEUR_CHOICES, null=True, blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='pending')
    reference_paydunya = models.CharField(max_length=100, unique=True, null=True, blank=True)
    telephone = models.CharField(max_length=20)
    metadata = models.JSONField(default=dict, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_mise_a_jour = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transactions'
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.type_transaction} - {self.montant} FCFA - {self.statut}"

    def remboursement_auto(self):
        return self.montant < SEUIL_REMBOURSEMENT_AUTO


class QuickPay(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente paiement'),
        ('paye', 'Paye'),
        ('expire', 'Expire'),
    ]

    expediteur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quickpay_envoyes'
    )
    destinataire = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quickpay_recus'
    )
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    message = models.CharField(max_length=200, blank=True)
    expire_le = models.DateTimeField(null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'quickpay'
        ordering = ['-date_creation']

    def __str__(self):
        return f"QP {self.expediteur} -> {self.destinataire} : {self.montant} FCFA"

    def est_expire(self):
        if not self.expire_le:
            return False
        return timezone.now() > self.expire_le

    def save(self, *args, **kwargs):
        # expiration 1h apres creation
        if not self.pk:
            self.expire_le = timezone.now() + timedelta(hours=1)
        super().save(*args, **kwargs)


class DemandeRemboursement(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('approuvee', 'Approuvee'),
        ('refusee', 'Refusee'),
        ('executee', 'Executee'),
    ]

    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name='demandes_remboursement'
    )
    demandeur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='demandes_remboursement'
    )
    motif = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    traitement_auto = models.BooleanField(default=False)
    traite_par = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='remboursements_traites'
    )
    date_creation = models.DateTimeField(auto_now_add=True)
    date_traitement = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'demandes_remboursement'
        ordering = ['-date_creation']

    def __str__(self):
        return f"Remboursement {self.transaction} - {self.statut}"