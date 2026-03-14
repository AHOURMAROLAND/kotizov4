from rest_framework import serializers
from .models import QuickPay


class QuickPayCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickPay
        fields = ['montant', 'description', 'numero_receveur']

    def validate_montant(self, value):
        if value < 200:
            raise serializers.ValidationError('Montant minimum 200 FCFA')
        if value > 25000:
            raise serializers.ValidationError('Montant maximum 25 000 FCFA')
        return value

    def validate_numero_receveur(self, value):
        from core.utils import normaliser_numero
        return normaliser_numero(value)


class QuickPaySerializer(serializers.ModelSerializer):
    createur_nom = serializers.SerializerMethodField()
    secondes_restantes = serializers.SerializerMethodField()

    class Meta:
        model = QuickPay
        fields = [
            'id', 'code', 'montant', 'description',
            'statut', 'date_creation', 'date_expiration',
            'date_paiement', 'createur_nom', 'secondes_restantes',
            'recu_pdf_url',
        ]

    def get_createur_nom(self, obj):
        return f'{obj.createur.prenom} {obj.createur.nom}'

    def get_secondes_restantes(self, obj):
        from django.utils import timezone
        if obj.statut != 'actif':
            return 0
        delta = obj.date_expiration - timezone.now()
        return max(0, int(delta.total_seconds()))