from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class InscriptionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'nom', 'prenom', 'telephone_whatsapp', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Les mots de passe ne correspondent pas'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ConnexionSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'nom', 'prenom', 'telephone_whatsapp',
            'niveau', 'email_verifie', 'whatsapp_verifie',
            'biometrie_activee', 'date_creation'
        ]
        read_only_fields = ['id', 'niveau', 'email_verifie', 'whatsapp_verifie', 'date_creation']


class ChangerMotDePasseSerializer(serializers.Serializer):
    ancien_password = serializers.CharField(write_only=True)
    nouveau_password = serializers.CharField(write_only=True, validators=[validate_password])
    nouveau_password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['nouveau_password'] != data['nouveau_password2']:
            raise serializers.ValidationError({'nouveau_password': 'Les mots de passe ne correspondent pas'})
        return data


class ResetPasswordDemandeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    canal = serializers.ChoiceField(choices=['email', 'whatsapp'], default='email')


class ResetPasswordConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=8)
    email = serializers.EmailField()
    nouveau_password = serializers.CharField(write_only=True, validators=[validate_password])
    nouveau_password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['nouveau_password'] != data['nouveau_password2']:
            raise serializers.ValidationError({'nouveau_password': 'Les mots de passe ne correspondent pas'})
        return data