Aqui vai o essencial para criar **usuário** e **banco PostgreSQL** para o seu Django (local ou Docker). Pode copiar/colar.

# Via PostgreSQL instalado na máquina (psql)

```bash
# entrar no shell do postgres
sudo -u postgres psql
```

No prompt `psql`:

```sql
-- 1) criar usuário com senha
CREATE ROLE shop WITH LOGIN PASSWORD 'shop';

-- 2) criar banco com UTF-8 e dono = shop
CREATE DATABASE shop
  WITH OWNER = shop
       ENCODING = 'UTF8'
       TEMPLATE = template0;

-- 3) (opcional) garantir dono do schema public
ALTER DATABASE shop OWNER TO shop;
\c shop
ALTER SCHEMA public OWNER TO shop;

-- 4) (opcional) garantir permissões totais no banco
GRANT ALL PRIVILEGES ON DATABASE shop TO shop;

-- sair
\q
```

Teste o acesso:

```bash
psql "postgresql://shop:shop@127.0.0.1:5432/shop" -c "SELECT current_user, current_database();"
```

No `.env` do Django:

```
DB_NAME=shop
DB_USER=shop
DB_PASS=shop
DB_HOST=127.0.0.1
DB_PORT=5432
```

Depois:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

---

# Via Docker (imagem oficial)

## a) Com `docker run`

```bash
docker run -d --name pg-shop \
  -e POSTGRES_USER=shop \
  -e POSTGRES_PASSWORD=shop \
  -e POSTGRES_DB=shop \
  -p 5432:5432 \
  -v pgdata_shop:/var/lib/postgresql/data \
  postgres:16
```

Isso já sobe com banco `shop` e usuário `shop` criados.

## b) Com `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: shop
      POSTGRES_PASSWORD: shop
      POSTGRES_DB: shop
    ports:
      - "5432:5432"
    volumes:
      - pgdata_shop:/var/lib/postgresql/data
volumes:
  pgdata_shop:
```

Subir:

```bash
docker compose up -d
```

Conexão (URI) para usar no Django:

```
postgresql://shop:shop@127.0.0.1:5432/shop
```

Pronto! Se quiser, te passo também um script único `.sh` que detecta se é Docker ou local e já cria tudo automático. Quer?
