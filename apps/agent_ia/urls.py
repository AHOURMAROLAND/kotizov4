from django.urls import path
from . import views

urlpatterns = [
    path('message/', views.envoyer_message, name='ia-message'),
    path('historique/', views.historique_messages, name='ia-historique'),
    path('statut/', views.statut_ia, name='ia-statut'),
]