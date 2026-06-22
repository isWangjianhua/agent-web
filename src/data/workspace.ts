import type { Artifact } from "@/types/artifact";
import type { AgentSession } from "@/types/session";

export const sessions: AgentSession[] = [
  {
    id: "thread-parts-quote",
    title: "零件报价评估",
    status: "running",
    updatedAt: "18:12",
  },
  {
    id: "thread-drawing-review",
    title: "图纸识别复核",
    status: "idle",
    updatedAt: "17:42",
  },
  {
    id: "thread-supplier-search",
    title: "供应商能力检索",
    status: "blocked",
    updatedAt: "16:08",
  },
];

export const artifacts: Artifact[] = [
  {
    id: "artifact-quote",
    name: "quote-input.pdf",
    status: "ready",
    objectKey: "default/local-user/quote-input.pdf",
    contentType: "application/pdf",
  },
  {
    id: "artifact-drawing",
    name: "drawing-preview.json",
    status: "pending",
    objectKey: "default/local-user/drawing-preview.json",
    contentType: "application/json",
  },
];

export const runtimeChecks = [
  { label: "AgentScope", value: "app service", state: "online" },
  { label: "AG-UI", value: "/agui/run", state: "ready" },
  { label: "FastMCP", value: "external tools", state: "linked" },
  { label: "Mem0", value: "tenant scoped", state: "standby" },
  { label: "MinIO", value: "presigned uploads", state: "ready" },
] as const;
