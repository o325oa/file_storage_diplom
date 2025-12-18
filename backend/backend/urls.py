from django.contrib import admin
from django.urls import path, include
from storage import views
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import CustomTokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('adminpage/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/storage/', include('storage.urls')),
    path('s/<str:token>/', views.public_download, name='public_download'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
