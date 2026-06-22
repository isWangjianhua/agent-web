import { describe, expect, it, vi } from "vitest";

describe("runtime env", () => {
  it("normalizes the agent runtime URL without a trailing slash", async () => {
    vi.stubEnv("AGENT_RUNTIME_URL", "http://localhost:8100/");
    vi.resetModules();

    const { getServerEnv } = await import("./env");

    expect(getServerEnv().agentRuntimeUrl).toBe("http://localhost:8100");
    vi.unstubAllEnvs();
  });
});

