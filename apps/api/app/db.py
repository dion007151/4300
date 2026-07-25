import os
from typing import Generator
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./forfree_dev.db"
)

# Connect args for SQLite compatibility
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args=connect_args
)


def init_db() -> None:
    """Create all SQLModel database tables if they do not exist."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency for yielding database sessions."""
    with Session(engine) as session:
        yield session
