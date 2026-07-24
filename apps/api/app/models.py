from pydantic import BaseModel, Field


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
    tool: str = "chat"  # e.g. "chat", "grammar", "rewriter", "summarizer"

