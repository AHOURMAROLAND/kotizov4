from django.urls import path
from . import views

urlpatterns = [
    path('state/', views.enregistrer_log, name='state-log'),
]