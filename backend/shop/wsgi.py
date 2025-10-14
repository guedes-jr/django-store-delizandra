import os
from pathlib import Path
from django.core.wsgi import get_wsgi_application

env = Path(__file__).resolve().parent.parent / ".env"
if env.exists():
    try:
        from dotenv import load_dotenv
        load_dotenv(env)
    except Exception:
        pass

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "shop.settings")
application = get_wsgi_application()
