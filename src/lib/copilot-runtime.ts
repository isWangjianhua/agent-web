import type { RuntimeIdentity } from "./auth-headers";

export type CopilotRuntimeRequest = {
  threadId?: string;
  thread_id?: string;
  runId?: string;
  run_id?: string;
  agentId?: string;
  agent_id?: string;
  messages?: unknown[];
  state?: Record<string, unknown>;
  [key: string]: unknown;
};

export type RuntimeRunRequest = {
  threadId: string;
  runId: string;
  agentId: string;
  messages: unknown[];
  state: Record<string, unknown>;
};

export function toRuntimeRunRequest(
  body: CopilotRuntimeRequest,
): RuntimeRunRequest {
  return {
    threadId:
      body.threadId || body.thread_id || `thread-${crypto.randomUUID()}`,
    runId: body.runId || body.run_id || `run-${crypto.randomUUID()}`,
    agentId: body.agentId || body.agent_id || "default",
    messages: Array.isArray(body.messages) ? body.messages : [],
    state: body.state || {},
  };
}

export function extractRuntimeIdentity(headers: Headers): RuntimeIdentity {
  return {
    userId: headers.get("x-user-id") || undefined,
    tenantId: headers.get("x-tenant-id") || undefined,
  };
}
