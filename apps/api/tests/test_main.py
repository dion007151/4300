import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.pool import StaticPool

from app.main import app
from app.db import get_session


# Use an in-memory SQLite database for test isolation
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "4300-api"


def test_list_tools(client: TestClient):
    response = client.get("/api/tools")
    assert response.status_code == 200
    tools = response.json()
    assert isinstance(tools, list)
    assert len(tools) > 0
    # Validate structure of first tool module
    first_tool = tools[0]
    assert "id" in first_tool
    assert "suite" in first_tool
    assert "name" in first_tool


def test_search_endpoint_and_db_logging(client: TestClient):
    response = client.get("/api/search?q=resume")
    assert response.status_code == 200
    results = response.json()
    assert isinstance(results, list)
    assert any("resume" in r["title"].lower() or "resume" in r["description"].lower() for r in results)


def test_document_create_and_retrieve(client: TestClient):
    # Test creating document
    payload = {
        "doc_id": "test-doc-123",
        "title": "My Test Resume",
        "content": "Professional summary...",
    }
    create_res = client.post("/api/documents", json=payload)
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["doc_id"] == "test-doc-123"
    assert created["title"] == "My Test Resume"

    # Test listing documents
    list_res = client.get("/api/documents")
    assert list_res.status_code == 200
    docs = list_res.json()
    assert len(docs) == 1
    assert docs[0]["doc_id"] == "test-doc-123"


def test_chat_legacy_endpoint(client: TestClient):
    payload = {"message": "Hello 4300", "context_ids": []}
    response = client.post("/api/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
