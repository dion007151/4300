import json
from contextlib import asynccontextmanager
from typing import Generator
from fastapi import FastAPI, Depends, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select

from .models import (
    ChatRequest,
    ChatResponse,
    SearchResult,
    AIStreamRequest,
    SearchHistory,
    DocumentRecord,
    DocumentCreateRequest,
)
from .plugins import TOOL_MODULES, search_modules
from .ai_providers import stream_ai_response
from .db import init_db, get_session
from .auth import verify_jwt_token
from .cache import cache_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on application startup
    init_db()
    yield


app = FastAPI(
    title="4300 API",
    description="Core API for the 4300 all-in-one AI productivity platform.",
    version="0.3.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "4300-api", "version": "0.3.0"}


@app.get("/api/tools")
def list_tools() -> list:
    return TOOL_MODULES


@app.get("/api/search")
def search(
    q: str = Query(default="", min_length=0),
    db: Session = Depends(get_session),
    user: dict = Depends(verify_jwt_token),
) -> list[SearchResult]:
    cache_key = f"search:{q.strip().lower()}"
    cached = cache_manager.get(cache_key)
    if cached is not None:
        return cached

    modules = search_modules(q)

    # Persist search query into PostgreSQL/SQLite DB
    if q.strip():
        search_log = SearchHistory(query=q.strip(), results_count=len(modules))
        db.add(search_log)
        db.commit()

    results = [
        SearchResult(
            id=module.id,
            title=module.name,
            kind=module.suite,
            description=module.description,
        )
        for module in modules
    ]

    cache_manager.set(cache_key, results, ttl=120)
    return results


@app.post("/api/storage/presigned-url")
def generate_presigned_url(
    filename: str,
    content_type: str = "application/octet-stream",
    user: dict = Depends(verify_jwt_token),
) -> dict:
    """Generate MinIO / S3 presigned upload URL for documents, audio, and video assets."""
    s3_endpoint = os.getenv("S3_ENDPOINT", "http://localhost:9000")
    s3_bucket = os.getenv("S3_BUCKET", "4300-files")
    
    upload_url = f"{s3_endpoint}/{s3_bucket}/{filename}"
    return {
        "upload_url": upload_url,
        "method": "PUT",
        "headers": {"Content-Type": content_type},
        "filename": filename,
    }


@app.get("/api/documents")
def list_documents(
    db: Session = Depends(get_session),
    user: dict = Depends(verify_jwt_token),
) -> list[DocumentRecord]:
    """Retrieve saved documents from database."""
    statement = select(DocumentRecord).order_by(DocumentRecord.created_at.desc())
    return list(db.exec(statement).all())


@app.post("/api/documents", status_code=status.HTTP_201_CREATED)
def create_document(
    doc: DocumentCreateRequest,
    db: Session = Depends(get_session),
    user: dict = Depends(verify_jwt_token),
) -> DocumentRecord:
    """Save or update a document in database."""
    statement = select(DocumentRecord).where(DocumentRecord.doc_id == doc.doc_id)
    existing = db.exec(statement).first()

    if existing:
        existing.title = doc.title
        existing.content = doc.content
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing

    new_doc = DocumentRecord(
        doc_id=doc.doc_id,
        title=doc.title,
        content=doc.content,
        owner_email=user.get("email", "demo@4300.to"),
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc


@app.post("/api/ai/chat")
def chat(request: ChatRequest) -> ChatResponse:
    """Legacy non-streaming endpoint kept for backwards compatibility."""
    return ChatResponse(
        answer=(
            "AI provider integration is ready to connect. "
            "Use POST /api/ai/stream for streaming responses."
        ),
        used_context_ids=request.context_ids,
    )


@app.post("/api/ai/stream")
async def stream_chat(request: AIStreamRequest):
    """
    Streaming SSE endpoint.
    Yields Server-Sent Events in the format: data: <json>\n\n
    """
    async def event_generator():
        try:
            async for chunk in stream_ai_response(request.message):
                payload = json.dumps({"delta": chunk})
                yield f"data: {payload}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            error_payload = json.dumps({"error": str(e)})
            yield f"data: {error_payload}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
