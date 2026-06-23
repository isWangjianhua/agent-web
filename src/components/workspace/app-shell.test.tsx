import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "./app-shell";

vi.mock("@/components/copilot/agent-chat", () => ({
  AgentChat: () => <div data-testid="agent-chat" />,
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
});
