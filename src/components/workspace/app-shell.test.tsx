import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "./app-shell";

vi.mock("@/components/copilot/agent-chat", () => ({
  AgentChat: ({ threadId }: { threadId: string }) => (
    <div data-testid="agent-chat" data-thread-id={threadId} />
  ),
}));

vi.mock("@copilotkit/react-core/v2", () => ({
  CopilotChatConfigurationProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <>{children}</>,
}));

describe("AppShell", () => {
  it("renders a two-column chatbot layout", () => {
    render(<AppShell />);

    expect(screen.getByRole("button", { name: "New chat" })).toBeVisible();
    expect(screen.getByText("Session History")).toBeVisible();
    expect(screen.getByTestId("agent-chat")).toBeVisible();
  });

  it("does not render workspace side panels", () => {
    render(<AppShell />);

    expect(screen.queryByText("Artifacts")).not.toBeInTheDocument();
    expect(screen.queryByText("Runtime")).not.toBeInTheDocument();
    expect(screen.queryByText("Memory Scope")).not.toBeInTheDocument();
    expect(screen.queryByText("Run Context")).not.toBeInTheDocument();
  });

  it("creates a new active session when New chat is clicked", () => {
    render(<AppShell />);

    const initialChat = screen.getByTestId("agent-chat");
    const initialThreadId = initialChat.getAttribute("data-thread-id");

    fireEvent.click(screen.getByRole("button", { name: "New chat" }));

    expect(screen.getByRole("button", { name: /New chat 1/ })).toBeVisible();
    expect(screen.getByRole("heading", { name: "New chat 1" })).toBeVisible();
    expect(screen.getByText("Just now")).toBeVisible();

    const newThreadId = screen
      .getByTestId("agent-chat")
      .getAttribute("data-thread-id");

    expect(newThreadId).toMatch(/^thread-/);
    expect(newThreadId).not.toBe(initialThreadId);
  });
});
