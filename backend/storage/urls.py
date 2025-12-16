from django.urls import path
from . import views

app_name = 'storage'

urlpatterns = [
    path('files/', views.file_list, name='file_list'),
    path('upload/', views.upload_file, name='upload_file'),
    path('files/<int:file_id>/', views.delete_file, name='delete_file'),
    path('files/<int:file_id>/download/', views.download_file, name='download_file'),
    path('files/<int:file_id>/publish/', views.publish_file, name='publish_file'),
    path('files/<int:file_id>/rename/', views.rename_file, name='rename_file'),
    path('files/<int:file_id>/comment/', views.update_comment, name='update_comment'),
    path('files/<int:file_id>/public/', views.generate_public_link, name='generate_public_link'),
    path('s/<str:token>/', views.public_download, name='public_download'),
]
