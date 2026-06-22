export type ServerEnv = {
  agentRuntimeUrl: string;
};

export function getServerEnv(): ServerEnv {
  return {
    agentRuntimeUrl: trimTrailingSlash(
      process.env.AGENT_RUNTIME_URL || "http://127.0.0.1:8100",
    ),
  };
}

export function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

