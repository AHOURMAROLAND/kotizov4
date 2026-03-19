from django.urls import path
from . import views

urlpatterns = [
    path('initier/', views.initier_paiement, name='initier-paiement'),
    path('webhook/', views.webhook_ipn, name='webhook-ipn'),
    path('quickpay/', views.creer_quickpay, name='creer-quickpay'),
    path('quickpay/mes/', views.mes_quickpay, name='mes-quickpay'),
    path('remboursement/<int:transaction_id>/', views.demander_remboursement, name='remboursement'),
]