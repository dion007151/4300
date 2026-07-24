"""
AI provider abstraction for 4300 API.

Supported providers (in priority order):
  1. groq      — Free tier, OpenAI-compatible, fast Llama/Mixtral models
  2. openai    — Requires paid credits
  3. anthropic — Requires paid credits
  4. ollama    — Local models, completely free, no internet needed
  5. mock      — Built-in chunked mock (always works, no key needed)

Set AI_PROVIDER + the matching API key in apps/api/.env
"""

import asyncio
import os
from pathlib import Path
from typing import AsyncGenerator

# ── Load .env automatically in local dev ─────────────────────────────────────
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass

# ── Read provider config ──────────────────────────────────────────────────────
_PROVIDER     = os.getenv("AI_PROVIDER", "groq").lower()
_GROQ_KEY     = os.getenv("GROQ_API_KEY", "")
_OPENAI_KEY   = os.getenv("OPENAI_API_KEY", "")
_ANTHROPIC_KEY= os.getenv("ANTHROPIC_API_KEY", "")
_OLLAMA_URL   = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
_OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

_SYSTEM_PROMPT = (
    "You are the 4300 AI assistant — an all-in-one free AI productivity platform. "
    "You help with writing, resumes, documents, images, productivity, job search, and more. "
    "Be helpful, concise, friendly, and encouraging. "
    "The platform motto is 'Everything. For Free.' 🚀"
)


# ── Mock fallback ─────────────────────────────────────────────────────────────

_MOCK_CHUNKS = [
    "Hey! I'm the **4300 AI assistant**. ",
    "To enable real AI responses, grab a **free Groq API key** at ",
    "[console.groq.com](https://console.groq.com) — no credit card needed! ",
    "Then set `GROQ_API_KEY=your-key` in `apps/api/.env` and restart the API. ",
    "Until then, I'll respond with this placeholder. **Everything. For Free.** 🚀"
]

async def _stream_mock(_: str) -> AsyncGenerator[str, None]:
    for chunk in _MOCK_CHUNKS:
        yield chunk
        await asyncio.sleep(0.06)


# ── Groq (free, OpenAI-compatible) ───────────────────────────────────────────

async def _stream_groq(message: str) -> AsyncGenerator[str, None]:
    try:
        from openai import AsyncOpenAI  # type: ignore
    except ImportError:
        async for c in _stream_mock(message):
            yield c
        return

    client = AsyncOpenAI(
        api_key=_GROQ_KEY,
        base_url="https://api.groq.com/openai/v1",
    )
    stream = await client.chat.completions.create(
        model="llama-3.1-8b-instant",   # free, very fast
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user",   "content": message},
        ],
        stream=True,
        max_tokens=1024,
        temperature=0.7,
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta


# ── OpenAI (paid) ─────────────────────────────────────────────────────────────

async def _stream_openai(message: str) -> AsyncGenerator[str, None]:
    try:
        from openai import AsyncOpenAI  # type: ignore
    except ImportError:
        async for c in _stream_mock(message):
            yield c
        return

    client = AsyncOpenAI(api_key=_OPENAI_KEY)
    stream = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user",   "content": message},
        ],
        stream=True,
        max_tokens=1024,
        temperature=0.7,
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta


# ── Anthropic (paid) ─────────────────────────────────────────────────────────

async def _stream_anthropic(message: str) -> AsyncGenerator[str, None]:
    try:
        import anthropic  # type: ignore
    except ImportError:
        async for c in _stream_mock(message):
            yield c
        return

    client = anthropic.AsyncAnthropic(api_key=_ANTHROPIC_KEY)
    async with client.messages.stream(
        model="claude-3-5-haiku-20241022",
        max_tokens=1024,
        system=_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": message}],
    ) as stream:
        async for text in stream.text_stream:
            yield text


# ── Ollama (local, completely free) ──────────────────────────────────────────

async def _stream_ollama(message: str) -> AsyncGenerator[str, None]:
    try:
        import httpx  # type: ignore
        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream(
                "POST",
                f"{_OLLAMA_URL}/api/chat",
                json={
                    "model": _OLLAMA_MODEL,
                    "messages": [
                        {"role": "system", "content": _SYSTEM_PROMPT},
                        {"role": "user",   "content": message},
                    ],
                    "stream": True,
                },
            ) as resp:
                import json as _json
                async for line in resp.aiter_lines():
                    if not line:
                        continue
                    try:
                        data = _json.loads(line)
                        delta = data.get("message", {}).get("content", "")
                        if delta:
                            yield delta
                        if data.get("done"):
                            return
                    except Exception:
                        continue
    except Exception as e:
        yield f"\n⚠️ Ollama error: {e}. Make sure Ollama is running: `ollama serve`"


# ── Public entry point ────────────────────────────────────────────────────────

async def stream_ai_response(message: str) -> AsyncGenerator[str, None]:
    """
    Routes to the correct provider based on AI_PROVIDER env var.
    Falls back gracefully through the chain: groq → openai → mock.
    """
    if _PROVIDER == "groq" and _GROQ_KEY:
        async for chunk in _stream_groq(message):
            yield chunk
    elif _PROVIDER == "openai" and _OPENAI_KEY:
        async for chunk in _stream_openai(message):
            yield chunk
    elif _PROVIDER == "anthropic" and _ANTHROPIC_KEY:
        async for chunk in _stream_anthropic(message):
            yield chunk
    elif _PROVIDER == "ollama":
        async for chunk in _stream_ollama(message):
            yield chunk
    elif _GROQ_KEY:
        # Auto-fallback: if GROQ_API_KEY is set, use it regardless of AI_PROVIDER
        async for chunk in _stream_groq(message):
            yield chunk
    else:
        async for chunk in _stream_mock(message):
            yield chunk
