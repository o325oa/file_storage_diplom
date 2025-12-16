import os
import uuid
from django.core.files.storage import FileSystemStorage
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import UserFile
from django.conf import settings
from .serializers import UserFileSerializer, UpdateCommentSerializer, RenameFileSerializer
from accounts.permissions import IsAdminUser
import logging
from django.http import FileResponse
from django.utils import timezone
import secrets

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def file_list(request):
    user_id = request.GET.get('user_id')
    if request.user.is_admin and user_id:
        files = UserFile.objects.filter(owner_id=user_id)
    elif request.user.is_admin:
        files = UserFile.objects.all()
    else:
        files = UserFile.objects.filter(owner=request.user)
    serializer = UserFileSerializer(files, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    file = request.FILES.get('file')
    logger.info("File upload attempt by: %s", request.user.username)
    comment = request.data.get('comment', '')
    if not file:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

    if file.size > 100 * 1024 * 1024:
        return Response({'error': 'File too large'}, status=status.HTTP_400_BAD_REQUEST)

    stored_name = str(uuid.uuid4())
    relative_path = f"{request.user.id}/{stored_name}"

    fs = FileSystemStorage(location=settings.FILE_STORAGE_ROOT)
    filename = fs.save(relative_path, file)

    user_file = UserFile.objects.create(
        owner=request.user,
        original_name=file.name,
        stored_name=stored_name,
        size=file.size,
        comment=comment,
        relative_path=relative_path,
        public_token=None,
        is_public=False,
    )

    serializer = UserFileSerializer(user_file)
    logger.info("File uploaded: %s", filename)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_file(request, file_id):
    file = get_object_or_404(UserFile, id=file_id)
    if file.owner != request.user and not request.user.is_admin:
        return Response({'detail': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    file_path = os.path.join(settings.FILE_STORAGE_ROOT, file.relative_path)
    if os.path.exists(file_path):
        os.remove(file_path)
    file.delete()
    return Response({'detail': 'File deleted'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def publish_file(request, file_id):
    file = get_object_or_404(UserFile, id=file_id)
    if file.owner != request.user and not request.user.is_admin:
        return Response({'detail': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    file.public_token = str(uuid.uuid4())
    file.is_public = True
    file.save()
    publish_url = request.build_absolute_uri(f'/s/{file.public_token}/')
    return Response({'url': publish_url})


@api_view(['GET'])
def download_public_file(request, token):
    try:
        file = UserFile.objects.get(public_token=token, is_public=True)
    except UserFile.DoesNotExist:
        raise Http404("Файл не найден")

    file_path = os.path.join(settings.FILE_STORAGE_ROOT, file.relative_path)
    if not os.path.exists(file_path):
        raise Http404("Файл не найден на сервере")

    file.last_downloaded_at = timezone.now()
    file.save()

    response = FileResponse(
        open(file_path, 'rb'),
        as_attachment=True,
        filename=file.original_name
    )
    return response


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def rename_file(request, file_id):
    file = get_object_or_404(UserFile, id=file_id)
    if file.owner != request.user and not request.user.is_admin:
        return Response({'detail': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    serializer = RenameFileSerializer(data=request.data)
    if serializer.is_valid():
        file.original_name = serializer.validated_data['new_name']
        file.save()
        return Response({'detail': 'File renamed'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_comment(request, file_id):
    file = get_object_or_404(UserFile, id=file_id)
    if file.owner != request.user and not request.user.is_admin:
        return Response({'detail': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    serializer = UpdateCommentSerializer(data=request.data)
    if serializer.is_valid():
        file.comment = serializer.validated_data['comment']
        file.save()
        return Response({'detail': 'Comment updated'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_file(request, file_id):
    file = get_object_or_404(UserFile, id=file_id)
    if file.owner != request.user and not request.user.is_admin:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    file_path = os.path.join(settings.FILE_STORAGE_ROOT, file.relative_path)
    if not os.path.exists(file_path):
        return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)
    response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file.original_name)
    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_public_link(request, file_id):
    file_obj = UserFile.objects.get(id=file_id, owner=request.user)
    file_obj.public_token = secrets.token_urlsafe(32)
    file_obj.is_public = True
    file_obj.save()
    return Response({'public_link': f'/s/{file_obj.public_token}/'})


@api_view(['GET'])
@permission_classes([AllowAny])
def public_download(request, token):
    file_obj = UserFile.objects.filter(public_token=token, is_public=True).first()
    if file_obj:
        file_path = os.path.join(settings.FILE_STORAGE_ROOT, file_obj.relative_path)
        if not os.path.exists(file_path):
            return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)
        file_obj.last_download = timezone.now()
        file_obj.save()
        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_obj.original_name)
    return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

