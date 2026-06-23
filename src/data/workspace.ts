import type { Artifact } from "@/types/artifact";
import type { AgentSession } from "@/types/session";

export const sessions: AgentSession[] = [
];

export const artifacts: Artifact[] = [
];

export const runtimeChecks = [
  { label: "Agent Service", value: "app runtime", state: "online" },
  { label: "Run Protocol", value: "/agui/run", state: "ready" },
  { label: "Tools", value: "external actions", state: "linked" },
  { label: "Memory", value: "tenant scoped", state: "standby" },
  { label: "Storage", value: "presigned uploads", state: "ready" },
] as const;
