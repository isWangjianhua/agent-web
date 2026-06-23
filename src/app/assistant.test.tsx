import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Assistant } from "./assistant";

vi.mock("@assistant-ui/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@assistant-ui/react")>();

  return {
    ...actual,
    AssistantRuntimeProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="assistant-runtime-provider">{children}</div>
    ),
  };
});

vi.mock("@assistant-ui/react-ai-sdk", () => ({
  AssistantChatTransport: vi.fn(),
  useChatRuntime: () => ({ runtime: true }),
}));

vi.mock("@/components/assistant-ui/thread", () => ({
  Thread: () => <div data-testid="assistant-thread" />,
}));

describe("Assistant", () => {
  it("renders the assistant-ui minimal thread inside the runtime provider", () => {
    render(<Assistant />);

    expect(screen.getByTestId("assistant-runtime-provider")).toBeVisible();
    expect(screen.getByTestId("assistant-thread")).toBeVisible();
  });
});
