from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from django.urls import reverse

CustomUser = get_user_model()

class AccountsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'full_name': 'Test User',
            'email': 'test@example.com',
            'password': 'TestPass1!',
        }

    def test_register_user(self):
        response = self.client.post(reverse('accounts:register'), self.user_data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(CustomUser.objects.filter(username='testuser').exists())

    def test_login_user(self):
        CustomUser.objects.create_user(**self.user_data)
        response = self.client.post(reverse('accounts:login'), {
            'username': 'testuser',
            'password': 'TestPass1!'
        })
        self.assertEqual(response.status_code, 200)
