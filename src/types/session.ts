export type AgentSession = {
  id: string;
  title: string;
  status: "idle" | "running" | "blocked";
  updatedAt: string;
};

