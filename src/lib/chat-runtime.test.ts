import { describe, expect, it, vi } from "vitest";

import { streamChatFromRuntime } from "./chat-runtime";

describe("streamChatFromRuntime", () => {
  it("forwards AI SDK chat bodies to the runtime chat endpoint", async () => {
    const stream = new ReadableStream();
    const fetcher = vi.fn().mockResolvedValue(
      new Response(stream, {
        status: 200,
        headers: {
          "content-type": "text/event-stream",
          "x-vercel-ai-ui-message-stream": "v1",
        },
      }),
    );

    const result = await streamChatFromRuntime({
      runtimeUrl: "http://runtime",
      body: {
        id: "chat-1",
        messages: [{ id: "msg-1", role: "user", parts: [] }],
      },
      headers: {
        "x-user-id": "u1",
        "x-tenant-id": "t1",
      },
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledWith("http://runtime/chat", {
      body: JSON.stringify({
        id: "chat-1",
        messages: [{ id: "msg-1", role: "user", parts: [] }],
      }),
      headers: {
        "content-type": "application/json",
        "x-tenant-id": "t1",
        "x-user-id": "u1",
      },
      method: "POST",
    });
    expect(result.headers.get("x-vercel-ai-ui-message-stream")).toBe("v1");
  });
});
