from rest_framework import serializers
from .models import CustomUser
from storage.models import UserFile
import re

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'full_name', 'email', 'is_admin', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user

    def validate_username(self, value):
        if not re.match(r'^[a-zA-Z][a-zA-Z0-9]{3,19}$', value):
            raise serializers.ValidationError("Логин должен содержать только латинские буквы и цифры, начинаться с буквы, длина 4-20 символов.")
        return value

    def validate_email(self, value):
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise serializers.ValidationError("Неверный формат email.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Пароль должен быть не менее 6 символов.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Пароль должен содержать хотя бы одну заглавную букву.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Пароль должен содержать хотя бы одну цифру.")
        if not re.search(r'[^a-zA-Z0-9]', value):
            raise serializers.ValidationError("Пароль должен содержать хотя бы один специальный символ.")
        return value
    
class AdminUserSerializer(serializers.ModelSerializer):
    file_count = serializers.SerializerMethodField()
    total_size = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'full_name', 'email', 'is_admin', 'file_count', 'total_size']

    def get_file_count(self, obj):
        return UserFile.objects.filter(owner=obj).count()

    def get_total_size(self, obj):
        return UserFile.objects.filter(owner=obj).aggregate(total=models.Sum('size'))['total'] or 0