import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


def _build_database_url() -> str:
    # Cloud-first: a full DATABASE_URL (Supabase direct 5432) takes precedence.
    # Supabase requires SSL; auto-append sslmode=require for supabase.co hosts
    # when the caller did not specify an sslmode explicitly.
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        if database_url.startswith("postgresql://"):
            database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)
        if "sslmode" not in database_url and "supabase.co" in database_url:
            sep = "&" if "?" in database_url else "?"
            database_url += f"{sep}sslmode=require"
        return database_url

    host = os.environ.get("POSTGRES_HOST", "postgres")
    port = os.environ.get("POSTGRES_PORT", "5432")
    user = os.environ.get("POSTGRES_USER", "postgres")
    password = os.environ.get("POSTGRES_PASSWORD", "postgres")
    db = os.environ.get("APP_DB_NAME", "mem0_app")
    url = f"postgresql+psycopg://{user}:{password}@{host}:{port}/{db}"
    sslmode = os.environ.get("POSTGRES_SSLMODE")
    if sslmode and "sslmode" not in url:
        url += f"?sslmode={sslmode}"
    elif "supabase.co" in host and "sslmode" not in url:
        url += "?sslmode=require"
    return url


engine = create_engine(_build_database_url(), pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency that yields a SQLAlchemy session."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
