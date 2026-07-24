/**
 * Reusable SSE streaming client for the 4300 AI backend.
 * Calls POST /api/ai/stream and yields text deltas via a callback.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface StreamOptions {
  message: string;
  tool?: string;
  onDelta: (chunk: string) => void;
  onDone?: () => void;
  onError?: (err: string) => void;
  signal?: AbortSignal;
}

export async function streamChat({
  message,
  tool = "chat",
  onDelta,
  onDone,
  onError,
  signal,
}: StreamOptions): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/api/ai/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, tool }),
      signal,
    });
  } catch (err) {
    onError?.((err as Error).message);
    return;
  }

  if (!response.ok) {
    onError?.(`API error ${response.status}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError?.("No response body");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // keep incomplete last line

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (!raw) continue;

      try {
        const event = JSON.parse(raw) as {
          delta?: string;
          done?: boolean;
          error?: string;
        };

        if (event.error) {
          onError?.(event.error);
          return;
        }
        if (event.done) {
          onDone?.();
          return;
        }
        if (event.delta) {
          onDelta(event.delta);
        }
      } catch {
        // Ignore malformed SSE lines
      }
    }
  }

  onDone?.();
}
