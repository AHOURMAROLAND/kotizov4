from django.urls import path
from . import views

urlpatterns = [
    path('', views.mes_notifications, name='notifications'),
    path('<int:notification_id>/lu/', views.marquer_lu, name='marquer-lu'),
    path('tout-lu/', views.marquer_tout_lu, name='tout-lu'),
    path('device-token/', views.enregistrer_device_token, name='device-token'),
]