export type AgentChatSuggestionConfiguration = {
  instructions: string;
  minSuggestions?: number;
  maxSuggestions?: number;
  className?: string;
};

export const agentChatSuggestions: Record<
  string,
  AgentChatSuggestionConfiguration
> = {};
