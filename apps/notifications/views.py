from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from .models import Notification, DeviceToken
from .serializers import NotificationSerializer, DeviceTokenSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mes_notifications(request):
    notifications = Notification.objects.filter(
        destinataire=request.user
    ).order_by('-date_creation')[:50]
    return Response(NotificationSerializer(notifications, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marquer_lu(request, notification_id):
    try:
        notif = Notification.objects.get(id=notification_id, destinataire=request.user)
        notif.lu = True
        notif.date_lecture = timezone.now()
        notif.save()
        return Response({'message': 'Notification marquee comme lue'})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marquer_tout_lu(request):
    Notification.objects.filter(
        destinataire=request.user,
        lu=False
    ).update(lu=True, date_lecture=timezone.now())
    return Response({'message': 'Toutes les notifications marquees comme lues'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enregistrer_device_token(request):
    serializer = DeviceTokenSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    token = serializer.validated_data['token']
    plateforme = serializer.validated_data['plateforme']

    DeviceToken.objects.update_or_create(
        token=token,
        defaults={
            'utilisateur': request.user,
            'plateforme': plateforme,
            'actif': True
        }
    )
    return Response({'message': 'Device token enregistre'})