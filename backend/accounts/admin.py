from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'is_admin', 'storage_link']
    list_editable = ['is_admin']

    def storage_link(self, obj):
        return format_html('<a href="http://localhost:3000/dashboard/?user_id={}" target="_blank">Хранилище</a>', obj.id)