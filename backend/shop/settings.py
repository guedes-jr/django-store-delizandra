from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev")
DEBUG = os.getenv("DEBUG", "1") == "1"
ALLOWED_HOSTS: list[str] = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "catalog.apps.CatalogConfig",
    "orders",
    "api",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "shop.urls"
TEMPLATES = [{"BACKEND": "django.template.backends.django.DjangoTemplates", "DIRS": [], "APP_DIRS": True, "OPTIONS": {"context_processors": [
    "django.template.context_processors.debug",
    "django.template.context_processors.request",
    "django.contrib.auth.context_processors.auth",
    "django.contrib.messages.context_processors.messages",
]}}]
WSGI_APPLICATION = "shop.wsgi.application"

DATABASES = {"default": {"ENGINE": "django.db.backends.postgresql", "NAME": os.getenv("DB_NAME", "shop"), "USER": os.getenv("DB_USER", "shop"), "PASSWORD": os.getenv("DB_PASS", "shop"), "HOST": os.getenv("DB_HOST", "127.0.0.1"), "PORT": os.getenv("DB_PORT", "5432")}}

AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Fortaleza"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 24,
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.AnonRateThrottle", "rest_framework.throttling.UserRateThrottle"],
    "DEFAULT_THROTTLE_RATES": {"anon": "300/min", "user": "600/min"},
}


CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    # adicione o domínio da sua página Lovable quando publicar
]

DEFAULT_PRODUCT_IMAGE = "https://via.placeholder.com/600"
MAX_QTY_PER_ITEM = 10