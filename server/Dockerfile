# Production image for the Mem0 REST API (Supabase cloud Postgres, no local DB).
# Build from the server/ directory on the VPS:
#   cd server && docker build -t ai-memory .
# Or via make:  cd server && make build
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Migrate app tables (users, api_keys, settings) on Supabase, then serve.
# No --reload here: this is the production image (dev compose uses dev.Dockerfile).
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000"]
