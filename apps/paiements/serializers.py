from rest_framework import serializers
from .models import Transaction, QuickPay, DemandeRemboursement


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id', 'type_transaction', 'montant', 'operateur',
            'statut', 'reference_paydunya', 'telephone',
            'date_creation', 'date_mise_a_jour'
        ]
        read_only_fields = ['id', 'statut', 'reference_paydunya', 'date_creation', 'date_mise_a_jour']


class InitierPaiementSerializer(serializers.Serializer):
    participation_id = serializers.IntegerField()
    telephone = serializers.CharField(max_length=20)
    operateur = serializers.ChoiceField(choices=['mixx', 'moov', 'tmoney'])


class QuickPayCreerSerializer(serializers.Serializer):
    destinataire_id = serializers.IntegerField()
    montant = serializers.DecimalField(max_digits=12, decimal_places=2)
    message = serializers.CharField(max_length=200, required=False, allow_blank=True)


class QuickPaySerializer(serializers.ModelSerializer):
    est_expire = serializers.SerializerMethodField()

    class Meta:
        model = QuickPay
        fields = [
            'id', 'expediteur', 'destinataire', 'montant',
            'statut', 'message', 'expire_le', 'date_creation', 'est_expire'
        ]
        read_only_fields = ['id', 'expediteur', 'statut', 'expire_le', 'date_creation']

    def get_est_expire(self, obj):
        return obj.est_expire()


class DemandeRemboursementSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemandeRemboursement
        fields = ['id', 'transaction', 'motif', 'statut', 'traitement_auto', 'date_creation']
        read_only_fields = ['id', 'statut', 'traitement_auto', 'date_creation']