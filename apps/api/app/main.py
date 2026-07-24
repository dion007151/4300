import json
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .models import ChatRequest, ChatResponse, SearchResult, AIStreamRequest
from .plugins import TOOL_MODULES, search_modules
from .ai_providers import stream_ai_response

app = FastAPI(
    title="4300 API",
    description="Core API for the 4300 all-in-one AI productivity platform.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "4300-api"}


@app.get("/api/tools")
def list_tools() -> list:
    return TOOL_MODULES


@app.get("/api/search")
def search(q: str = Query(default="", min_length=0)) -> list[SearchResult]:
    modules = search_modules(q)
    return [
        SearchResult(
            id=module.id,
            title=module.name,
            kind=module.suite,
            description=module.description,
        )
        for module in modules
    ]


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
    Yields Server-Sent Events in the format: data: <json>\\n\\n
    Each event has { "delta": "<text chunk>" } or { "done": true }.
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
