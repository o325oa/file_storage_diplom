import uuid
from django.db import models
from accounts.models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()

class UserFile(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    original_name = models.CharField(max_length=255)
    stored_name = models.CharField(max_length=255, unique=True)
    size = models.BigIntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    last_downloaded_at = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)
    relative_path = models.CharField(max_length=255)
    public_token = models.UUIDField(max_length=255, blank=True, null=True, unique=True)
    is_public = models.BooleanField(default=False)
