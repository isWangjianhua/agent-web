import { buildRuntimeHeaders } from "./auth-headers";

type RuntimeRequestOptions = {
  runtimeUrl: string;
  body: unknown;
  headers?: Record<string, string>;
  fetcher?: typeof fetch;
};

export async function streamChatFromRuntime({
  runtimeUrl,
  body,
  headers,
  fetcher = fetch,
}: RuntimeRequestOptions): Promise<Response> {
  const response = await fetcher(`${runtimeUrl}/chat`, {
    method: "POST",
    headers: {
      ...buildRuntimeHeaders(),
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    const message = await safeResponseText(response);
    return new Response(message || "Agent runtime chat request failed.", {
      status: response.status || 502,
    });
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") || "text/event-stream",
      "cache-control": response.headers.get("cache-control") || "no-cache",
      "x-vercel-ai-ui-message-stream":
        response.headers.get("x-vercel-ai-ui-message-stream") || "v1",
      "x-accel-buffering": response.headers.get("x-accel-buffering") || "no",
    },
  });
}

async function safeResponseText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}
