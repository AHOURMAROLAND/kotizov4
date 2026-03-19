from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email obligatoire')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    NIVEAU_CHOICES = [
        ('basic', 'Basique'),
        ('verified', 'Verifie'),
        ('business', 'Business'),
    ]

    email = models.EmailField(unique=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone_whatsapp = models.CharField(max_length=20, unique=True, null=True, blank=True)

    niveau = models.CharField(max_length=20, choices=NIVEAU_CHOICES, default='basic')
    email_verifie = models.BooleanField(default=False)
    whatsapp_verifie = models.BooleanField(default=False)
    date_verification = models.DateTimeField(null=True, blank=True)

    tentatives_echec = models.IntegerField(default=0)
    bloque_jusqu_au = models.DateTimeField(null=True, blank=True)

    biometrie_activee = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email

    def est_verifie(self):
        return self.email_verifie or self.whatsapp_verifie

    def est_bloque(self):
        if self.bloque_jusqu_au and timezone.now() < self.bloque_jusqu_au:
            return True
        return False


class VerificationToken(models.Model):
    CANAL_CHOICES = [
        ('whatsapp', 'WhatsApp'),
        ('email', 'Email'),
    ]

    TYPE_CHOICES = [
        ('inscription', 'Inscription'),
        ('reset_password', 'Reset mot de passe'),
        ('connexion_magique', 'Connexion magique'),
        ('changement_wa', 'Changement WhatsApp'),
    ]

    utilisateur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tokens')
    token = models.CharField(max_length=8)
    canal = models.CharField(max_length=10, choices=CANAL_CHOICES, default='email')
    type_token = models.CharField(max_length=20, choices=TYPE_CHOICES, default='inscription')
    utilise = models.BooleanField(default=False)
    expire_le = models.DateTimeField()
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'verification_tokens'

    def __str__(self):
        return f"Token {self.type_token} - {self.utilisateur} via {self.canal}"

    def est_valide(self):
        return not self.utilise and timezone.now() < self.expire_le


class TokenTentative(models.Model):
    identifiant = models.CharField(max_length=200)
    type_token = models.CharField(max_length=20, default='inscription')
    tentatives = models.IntegerField(default=0)
    bloque_jusqu_au = models.DateTimeField(null=True, blank=True)
    date_mise_a_jour = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'token_tentatives'
        unique_together = ['identifiant', 'type_token']

    def __str__(self):
        return f"{self.identifiant} - {self.tentatives} tentatives"

    def est_bloque(self):
        if self.bloque_jusqu_au and timezone.now() < self.bloque_jusqu_au:
            return True
        return False