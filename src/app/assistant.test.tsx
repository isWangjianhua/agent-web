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

const { useChatRuntimeMock } = vi.hoisted(() => ({
  useChatRuntimeMock: vi.fn(() => ({ runtime: true })),
}));

vi.mock("@assistant-ui/react-ai-sdk", () => ({
  AssistantChatTransport: vi.fn(),
  useChatRuntime: useChatRuntimeMock,
}));

vi.mock("@/components/assistant-ui/thread", () => ({
  Thread: () => <div data-testid="assistant-thread" />,
}));

vi.mock("@/components/assistant-ui/threadlist-sidebar", () => ({
  ThreadListSidebar: () => <aside data-testid="thread-list-sidebar" />,
}));

describe("Assistant", () => {
  it("renders the assistant-ui default shell inside the runtime provider", () => {
    render(<Assistant />);

    expect(screen.getByTestId("assistant-runtime-provider")).toBeVisible();
    expect(screen.getByTestId("thread-list-sidebar")).toBeVisible();
    expect(screen.getByTestId("assistant-thread")).toBeVisible();
    expect(screen.getByText("Agent Web")).toBeVisible();
  });

  it("does not auto-resubmit after backend-managed tool calls complete", () => {
    render(<Assistant />);

    expect(useChatRuntimeMock).toHaveBeenCalledWith(
      expect.not.objectContaining({
        sendAutomaticallyWhen: expect.anything(),
      }),
    );
  });
});
