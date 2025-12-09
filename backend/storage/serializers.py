from rest_framework import serializers
from .models import UserFile

class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFile
        fields = ['id', 'original_name', 'size', 'uploaded_at', 'last_downloaded_at', 'comment', 'public_token']

    def validate_size(self, value):
        if value > 100 * 1024 * 1024:
            raise serializers.ValidationError("Размер файла не должен превышать 100 МБ.")
        return value

class RenameFileSerializer(serializers.Serializer):
    new_name = serializers.CharField(max_length=255)

class UpdateCommentSerializer(serializers.Serializer):
    comment = serializers.CharField(max_length=255)