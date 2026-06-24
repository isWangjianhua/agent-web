import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Assistant } from "./assistant";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

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

vi.mock("@/components/assistant-ui/chatgpt-thread", () => ({
  ChatGPTThread: () => <div data-testid="chatgpt-thread" />,
}));

describe("Assistant", () => {
  it("renders the ChatGPT-style assistant-ui template inside the runtime provider", () => {
    render(<Assistant />);

    expect(screen.getByTestId("assistant-runtime-provider")).toBeVisible();
    expect(screen.getByTestId("chatgpt-thread")).toBeVisible();
  });
});
