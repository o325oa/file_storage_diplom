from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from .serializers import AdminUserSerializer, CustomUserSerializer
import logging
import os
from django.conf import settings
from storage.models import UserFile
from django.db import models

logger = logging.getLogger(__name__)
CustomUser = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_user_list(request):
    users = CustomUser.objects.all()
    serializer = AdminUserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return Response({'detail': 'Logged in'}, status=status.HTTP_200_OK)
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'detail': 'Logged out'}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    files = UserFile.objects.filter(owner=user)
    for file in files:
        file_path = os.path.join(settings.FILE_STORAGE_ROOT, file.relative_path)
        if os.path.exists(file_path):
            os.remove(file_path)
        file.delete()
    user.delete()
    return Response({'detail': 'User deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAdminUser])
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
            'full_name': user.full_name,
            'email': user.email,
            'is_admin': user.is_admin,
            'file_count': file_count,
            'total_size': total_size,
        })
    return Response(data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    files = UserFile.objects.filter(owner=user)
    for file in files:
        file_path = os.path.join(settings.FILE_STORAGE_ROOT, file.relative_path)
        if os.path.exists(file_path):
            os.remove(file_path)
        file.delete()
    user.delete()
    return Response({'detail': 'User deleted'}, status=status.HTTP_204_NO_CONTENT)