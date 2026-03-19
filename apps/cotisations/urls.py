from django.urls import path
from . import views

urlpatterns = [
    path('', views.cotisations_liste_creer, name='cotisations'),
    path('mes-cotisations/', views.mes_cotisations, name='mes-cotisations'),
    path('<str:slug>/', views.cotisation_detail, name='cotisation-detail'),
    path('<str:slug>/rejoindre/', views.rejoindre_cotisation, name='rejoindre'),
    path('<str:slug>/commentaires/', views.commentaires, name='commentaires'),
    path('<str:slug>/signaler/', views.signaler_cotisation, name='signaler'),
]