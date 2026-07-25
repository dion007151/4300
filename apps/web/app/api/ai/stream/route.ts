import { NextRequest } from "next/server";

export const runtime = "edge";

const GROQ_API_KEY  = process.env.GROQ_API_KEY  ?? "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const AI_PROVIDER   = process.env.AI_PROVIDER   ?? "groq";

const SYSTEM_PROMPT =
  "You are the 4300 AI assistant — an all-in-one free AI productivity platform. " +
  "You help with writing, resumes, documents, images, productivity, job search, and more. " +
  "Be helpful, concise, friendly, and encouraging. " +
  "The platform motto is 'Everything. For Free.' 🚀";

// ── Mock fallback chunks ──────────────────────────────────────────────────────
const MOCK_CHUNKS = [
  "Hey! I'm the **4300 AI assistant**. ",
  "To enable real AI responses, add `GROQ_API_KEY=your-key` to `apps/web/.env.local`. ",
  "Get a free key at [console.groq.com](https://console.groq.com) — no credit card needed! ",
  "Until then I'll respond with this placeholder. **Everything. For Free.** 🚀",
];

function mockStream(): ReadableStream {
  let idx = 0;
  return new ReadableStream({
    async start(controller) {
      for (const chunk of MOCK_CHUNKS) {
        const payload = JSON.stringify({ delta: chunk });
        controller.enqueue(new TextEncoder().encode(`data: ${payload}\n\n`));
        await new Promise((r) => setTimeout(r, 60));
      }
      controller.enqueue(
        new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`)
      );
      controller.close();
    },
  });
}

// ── Groq / OpenAI-compatible streaming ───────────────────────────────────────
async function groqStream(
  message: string,
  apiKey: string,
  baseUrl: string,
  model: string
): Promise<ReadableStream> {
  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.text();
    throw new Error(`Upstream API error ${upstream.status}: ${err}`);
  }

  const reader = upstream.body!.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ done: true })}\n\n`
                )
              );
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(raw);
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (delta) {
                controller.enqueue(
                  new TextEncoder().encode(
                    `data: ${JSON.stringify({ delta })}\n\n`
                  )
                );
              }
            } catch {
              // skip malformed SSE lines
            }
          }
        }
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ done: true })}\n\n`
          )
        );
        controller.close();
      } catch (e) {
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ error: String(e) })}\n\n`
          )
        );
        controller.close();
      }
    },
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: { message?: string; tool?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(
      `data: ${JSON.stringify({ error: "Invalid JSON body" })}\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return new Response(
      `data: ${JSON.stringify({ error: "message is required" })}\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  let stream: ReadableStream;

  try {
    if ((AI_PROVIDER === "groq" || !AI_PROVIDER) && GROQ_API_KEY) {
      stream = await groqStream(
        message,
        GROQ_API_KEY,
        "https://api.groq.com/openai/v1",
        "llama-3.1-8b-instant"
      );
    } else if (AI_PROVIDER === "openai" && OPENAI_API_KEY) {
      stream = await groqStream(
        message,
        OPENAI_API_KEY,
        "https://api.openai.com/v1",
        "gpt-4o-mini"
      );
    } else if (GROQ_API_KEY) {
      // auto-fallback: use Groq if key is present regardless of provider setting
      stream = await groqStream(
        message,
        GROQ_API_KEY,
        "https://api.groq.com/openai/v1",
        "llama-3.1-8b-instant"
      );
    } else {
      stream = mockStream();
    }
  } catch (e) {
    stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ error: String(e) })}\n\n`
          )
        );
        controller.close();
      },
    });
  }

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
