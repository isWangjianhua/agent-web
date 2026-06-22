export type AGUIRunRequest = {
  threadId: string;
  runId: string;
  agentId: string;
  messages: Array<{
    id?: string;
    role: string;
    content?: string | Array<Record<string, unknown>> | null;
  }>;
  state?: Record<string, unknown>;
};

