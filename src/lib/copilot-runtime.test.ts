import { describe, expect, it, vi } from "vitest";

import { extractRuntimeIdentity, toRuntimeRunRequest } from "./copilot-runtime";

describe("copilot runtime mapping", () => {
  it("maps CopilotKit-like request bodies to the agent-runtime AG-UI shape", () => {
    const randomUUID = vi
      .spyOn(crypto, "randomUUID")
      .mockReturnValue("generated-id");

    expect(
      toRuntimeRunRequest({
        agent_id: "default-agent",
        messages: [{ role: "user", content: "summarize this" }],
      }),
    ).toEqual({
      threadId: "thread-generated-id",
      runId: "run-generated-id",
      agentId: "default-agent",
      messages: [{ role: "user", content: "summarize this" }],
      state: {},
    });

    randomUUID.mockRestore();
  });

  it("extracts local development identity headers", () => {
    const headers = new Headers({
      "x-user-id": "u1",
      "x-tenant-id": "t1",
    });

    expect(extractRuntimeIdentity(headers)).toEqual({
      userId: "u1",
      tenantId: "t1",
    });
  });
});
