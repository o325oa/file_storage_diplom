from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import CustomTokenObtainPairView

app_name = 'accounts'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/users/', views.admin_user_list, name='admin_user_list'),
    path('admin/users/<int:user_id>/toggle/', views.toggle_admin_status, name='toggle_admin_status'),
    path('admin/users/<int:user_id>/', views.admin_delete_user, name='admin_delete_user'),
]
