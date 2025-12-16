from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import logging
import os
from django.conf import settings
from storage.models import UserFile
from django.db import models

logger = logging.getLogger(__name__)
CustomUser = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        logger.info(f"User {user.username} registered")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def admin_user_list(request):
    users = CustomUser.objects.all()
    data = []
    for user in users:
        files = UserFile.objects.filter(owner=user)
        file_count = files.count()
        total_size = files.aggregate(total=models.Sum('size'))['total'] or 0
        data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin,
            'file_count': file_count,
            'total_size': total_size,
        })
    return Response(data)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def toggle_admin_status(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    if user.id == request.user.id:
        return Response({'detail': 'Cannot change own admin status'}, status=status.HTTP_400_BAD_REQUEST)
    user.is_admin = not user.is_admin
    user.save()
    return Response({'detail': 'Admin status updated'})


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    files = UserFile.objects.filter(user=user)
    for file in files:
        file_path = os.path.join(settings.FILE_STORAGE_ROOT, file.relative_path)
        if os.path.exists(file_path):
            os.remove(file_path)
        file.delete()
    user.delete()
    return Response({'detail': 'User deleted'}, status=status.HTTP_204_NO_CONTENT)

