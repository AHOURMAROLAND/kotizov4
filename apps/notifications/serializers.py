from rest_framework import serializers
from .models import Notification, DeviceToken


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'type_notification', 'canal', 'titre',
            'contenu', 'lu', 'date_creation', 'date_lecture'
        ]
        read_only_fields = ['id', 'date_creation']


class DeviceTokenSerializer(serializers.Serializer):
    token = serializers.CharField()
    plateforme = serializers.ChoiceField(choices=['ios', 'android'])