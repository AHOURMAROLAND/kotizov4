from rest_framework import serializers
from .models import Cotisation, Participation, CommentaireCotisation, SignalementCotisation
from apps.users.serializers import UserSerializer


class CotisationSerializer(serializers.ModelSerializer):
    createur = UserSerializer(read_only=True)
    montant_collecte = serializers.SerializerMethodField()
    nombre_participants = serializers.SerializerMethodField()

    class Meta:
        model = Cotisation
        fields = [
            'id', 'slug', 'titre', 'description', 'montant_cible',
            'montant_par_membre', 'nombre_membres_max', 'statut',
            'signalements', 'date_creation', 'date_limite',
            'createur', 'montant_collecte', 'nombre_participants'
        ]
        read_only_fields = ['id', 'slug', 'signalements', 'date_creation', 'createur']

    def get_montant_collecte(self, obj):
        return obj.montant_collecte()

    def get_nombre_participants(self, obj):
        return obj.participations.filter(statut='payee').count()


class CotisationCreerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cotisation
        fields = ['titre', 'description', 'montant_cible', 'montant_par_membre',
                  'nombre_membres_max', 'date_limite']


class ParticipationSerializer(serializers.ModelSerializer):
    membre = UserSerializer(read_only=True)
    commentaire_autorise = serializers.SerializerMethodField()

    class Meta:
        model = Participation
        fields = [
            'id', 'cotisation', 'membre', 'montant', 'statut',
            'date_paiement', 'recu_url', 'recu_envoye_wa',
            'date_creation', 'commentaire_autorise'
        ]
        read_only_fields = ['id', 'membre', 'date_creation', 'recu_url', 'recu_envoye_wa']

    def get_commentaire_autorise(self, obj):
        return obj.commentaire_autorise()


class CommentaireSerializer(serializers.ModelSerializer):
    auteur = UserSerializer(read_only=True)

    class Meta:
        model = CommentaireCotisation
        fields = ['id', 'auteur', 'contenu', 'date_creation', 'date_modification']
        read_only_fields = ['id', 'auteur', 'date_creation', 'date_modification']


class CommentaireCreerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentaireCotisation
        fields = ['contenu']


class SignalementSerializer(serializers.ModelSerializer):
    class Meta:
        model = SignalementCotisation
        fields = ['id', 'motif', 'date_creation']
        read_only_fields = ['id', 'date_creation']