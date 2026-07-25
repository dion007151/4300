from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from sqlmodel import SQLModel, Field as SQLField


# ── SQLModel Database Entities ───────────────────────────────────────────────

class SearchHistory(SQLModel, table=True):
    id: Optional[int] = SQLField(default=None, primary_key=True)
    query: str = SQLField(index=True)
    results_count: int = 0
    created_at: datetime = SQLField(default_factory=datetime.utcnow)


class DocumentRecord(SQLModel, table=True):
    id: Optional[int] = SQLField(default=None, primary_key=True)
    doc_id: str = SQLField(index=True, unique=True)
    title: str
    content: str
    owner_email: Optional[str] = SQLField(default="demo@4300.to", index=True)
    created_at: datetime = SQLField(default_factory=datetime.utcnow)
    updated_at: datetime = SQLField(default_factory=datetime.utcnow)


# ── Pydantic Request/Response Models ─────────────────────────────────────────

class ToolModule(BaseModel):
    id: str
    suite: str
    name: str
    description: str
    status: str = Field(pattern="^(ready|beta|planned)$")
    accent: str
    keywords: list[str]


class SearchResult(BaseModel):
    id: str
    title: str
    kind: str
    description: str


class ChatRequest(BaseModel):
    message: str
    context_ids: list[str] = []


class ChatResponse(BaseModel):
    answer: str
    used_context_ids: list[str]


class AIStreamRequest(BaseModel):
    message: str
    context_ids: list[str] = []
    tool: str = "chat"


class DocumentCreateRequest(BaseModel):
    doc_id: str
    title: str
    content: str
