import os
import sys
from pathlib import Path

def main() -> None:
    env = Path(__file__).resolve().parent / ".env"
    if env.exists():
        try:
            from dotenv import load_dotenv
            load_dotenv(env)
        except Exception:
            pass
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "shop.settings")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()
