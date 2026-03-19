from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='admin-dashboard'),
    path('utilisateurs/', views.liste_utilisateurs, name='admin-utilisateurs'),
    path('utilisateurs/<int:user_id>/valider/', views.valider_verification, name='admin-valider'),
    path('utilisateurs/<int:user_id>/rejeter/', views.rejeter_verification, name='admin-rejeter'),
    path('utilisateurs/<int:user_id>/sanctionner/', views.sanctionner_utilisateur, name='admin-sanctionner'),
    path('alertes-fraude/', views.liste_alertes_fraude, name='admin-alertes'),
    path('remboursements/', views.remboursements_en_attente, name='admin-remboursements'),
    path('remboursements/<int:demande_id>/', views.traiter_remboursement, name='admin-traiter-remboursement'),
    path('config/whatsapp/', views.config_whatsapp, name='admin-config-wa'),
    path('config/generale/', views.config_generale, name='admin-config-generale'),
]