from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/cotisations/', include('apps.cotisations.urls')),
    path('api/paiements/', include('apps.paiements.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/agent/', include('apps.agent_ia.urls')),
    path('api/admin-panel/', include('apps.admin_panel.urls')),
    path('api/core/', include('apps.core.urls')),
    path('api/logs/', include('apps.logs.urls')),
]