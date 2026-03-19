from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('inscription/', views.inscription, name='inscription'),
    path('confirmer-email/', views.confirmer_email, name='confirmer-email'),
    path('confirmer-whatsapp/', views.confirmer_whatsapp, name='confirmer-whatsapp'),
    path('connexion/', views.connexion, name='connexion'),
    path('deconnexion/', views.deconnexion, name='deconnexion'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profil/', views.profil, name='profil'),
    path('changer-mot-de-passe/', views.changer_mot_de_passe, name='changer-mot-de-passe'),
    path('reset-password/', views.reset_password_demande, name='reset-password-demande'),
    path('reset-password/confirmer/', views.reset_password_confirmer, name='reset-password-confirmer'),
]