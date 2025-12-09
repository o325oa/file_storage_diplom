from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from django.urls import reverse
from .models import UserFile

CustomUser = get_user_model()

class StorageAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='testuser',
            password='TestPass1!',
            storage_path='testuser/'
        )
        self.client.force_authenticate(user=self.user)

    def test_upload_file(self):
        with open('test_file.txt', 'w') as f:
            f.write('test')
        with open('test_file.txt', 'rb') as f:
            response = self.client.post(reverse('storage:upload_file'), {
                'file': f,
                'comment': 'Test comment'
            }, format='multipart')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(UserFile.objects.filter(owner=self.user).exists())

def test_publish_file(self):
    user_file = UserFile.objects.create(
        owner=self.user,
        original_name='test.txt',
        stored_name='test.txt',
        size=10,
        relative_path='testuser/test.txt',
    )
    response = self.client.post(reverse('storage:publish_file', kwargs={'file_id': user_file.id}))
    self.assertEqual(response.status_code, 200)
    self.assertIn('url', response.data)

def test_rename_file(self):
    user_file = UserFile.objects.create(
        owner=self.user,
        original_name='test.txt',
        stored_name='test.txt',
        size=10,
        relative_path='testuser/test.txt',
    )
    response = self.client.patch(reverse('storage:rename_file', kwargs={'file_id': user_file.id}), {
        'new_name': 'renamed.txt'
    })
    self.assertEqual(response.status_code, 200)
    user_file.refresh_from_db()
    self.assertEqual(user_file.original_name, 'renamed.txt')

def test_update_comment(self):
    user_file = UserFile.objects.create(
        owner=self.user,
        original_name='test.txt',
        stored_name='test.txt',
        size=10,
        relative_path='testuser/test.txt',
    )
    response = self.client.patch(reverse('storage:update_comment', kwargs={'file_id': user_file.id}), {
        'comment': 'New comment'
    })
    self.assertEqual(response.status_code, 200)
    user_file.refresh_from_db()
    self.assertEqual(user_file.comment, 'New comment')

def test_admin_user_list(self):
    admin = CustomUser.objects.create_superuser(
        username='admin',
        password='admin',
        email='admin@example.com'
    )
    self.client.force_authenticate(user=admin)
    response = self.client.get(reverse('accounts:admin_user_list'))
    self.assertEqual(response.status_code, 200)
    self.assertIn('username', response.data[0])
