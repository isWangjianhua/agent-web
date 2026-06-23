import { describe, expect, it } from "vitest";

import { agentChatSuggestions } from "./agent-chat-config";

describe("agent chat config", () => {
  it("does not show default example suggestions", () => {
    expect(agentChatSuggestions).toEqual({});
  });
});
