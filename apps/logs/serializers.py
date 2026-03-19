from rest_framework import serializers
from .models import StateLog, AlerteFraude, Sanction


class StateLogSerializer(serializers.Serializer):
    event = serializers.CharField(max_length=100)
    details = serializers.DictField(required=False, default=dict)
    plateforme = serializers.ChoiceField(choices=['ios', 'android', 'web'], required=False)
    version_app = serializers.CharField(max_length=20, required=False, allow_blank=True)


class AlerteFraudeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlerteFraude
        fields = ['id', 'signaleur', 'signale', 'motif', 'statut', 'date_creation']
        read_only_fields = ['id', 'date_creation']


class SanctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sanction
        fields = ['id', 'utilisateur', 'type_sanction', 'motif', 'date_debut', 'date_fin', 'active']
        read_only_fields = ['id', 'date_debut']