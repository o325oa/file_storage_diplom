# Cloud Storage App

## Описание

Приложение для хранения файлов с регистрацией, авторизацией, управлением пользователями и файлами.

## Установка

1. Клонируйте репозиторий: 

### git clone ...

2. Создайте виртуальное окружение и установите зависимости:

### python -m venv venv
### source env/bin/activate
### pip install -r requirements.txt

3. Настройте базу данных и переменные окружения (см. `settings.py`).

4. Примените миграции:

### python manage.py migrate

5. Создайте суперпользователя:

### python manage.py createsuperuser

6. Запустите сервер:

### python manage.py runserver

## Тестирование

Запустите тесты:

### python manage.py test

## API

- `/accounts/register/` — регистрация пользователя.
- `/accounts/login/` — авторизация.
- `/accounts/logout/` — выход.
- `/accounts/admin/users/` — список пользователей (только для админа).
- `/storage/upload/` — загрузка файла.
- `/storage/files/{id}/publish/` — публикация файла.
- `/storage/files/{id}/rename/` — переименование файла.
- `/storage/files/{id}/comment/` — изменение комментария.

## Публичные ссылки

- `/s/{token}/` — скачивание файла по публичной ссылке.