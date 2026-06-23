"use client";

import {
  ChatCircleText,
  ClockCounterClockwise,
  Plus,
} from "@phosphor-icons/react";
import { CopilotChatConfigurationProvider } from "@copilotkit/react-core/v2";
import { useRef, useState } from "react";

import { AgentChat } from "@/components/copilot/agent-chat";
import { sessions } from "@/data/workspace";
import { cn } from "@/lib/utils";
import type { AgentSession } from "@/types/session";

const statusStyles = {
  idle: "bg-zinc-200 text-zinc-700",
  running: "bg-emerald-100 text-emerald-800",
  blocked: "bg-rose-100 text-rose-800",
} as const;

const agentId = "default";
const userId = "local-user";
const initialThreadId = "thread-local-draft";

function createThreadId() {
  const randomId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `thread-${randomId}`;
}

function createSession(position: number): AgentSession {
  return {
    id: createThreadId(),
    title: `New chat ${position}`,
    status: "idle",
    updatedAt: "Just now",
  };
}

export function AppShell() {
  const nextSessionPosition = useRef(sessions.length + 1);
  const [workspaceSessions, setWorkspaceSessions] = useState<AgentSession[]>(
    () => [...sessions],
  );
  const [activeThreadId, setActiveThreadId] = useState(
    () => sessions[0]?.id ?? initialThreadId,
  );

  const activeSession = workspaceSessions.find(
    (session) => session.id === activeThreadId,
  );

  function handleNewChat() {
    const session = createSession(nextSessionPosition.current);
    nextSessionPosition.current += 1;

    setWorkspaceSessions((current) => [session, ...current]);
    setActiveThreadId(session.id);
  }

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col border-b border-[var(--line)] bg-[var(--surface-muted)] md:h-dvh md:border-b-0 md:border-r">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line)] px-4">
            <div className="flex min-w-0 items-center gap-2">
              <div className="grid size-8 shrink-0 place-items-center rounded-md bg-zinc-950 text-white">
                <ChatCircleText size={17} weight="bold" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Agent Web</div>
                <div className="truncate text-[11px] text-[var(--muted)]">
                  local agent
                </div>
              </div>
            </div>
            <button
              className="icon-button"
              aria-label="New chat"
              onClick={handleNewChat}
            >
              <Plus size={18} />
            </button>
          </div>

          <section className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="mb-2 flex h-8 items-center gap-2 px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
              <ClockCounterClockwise size={15} />
              <span>Session History</span>
            </div>
            {workspaceSessions.length > 0 ? (
              <div className="space-y-1">
                {workspaceSessions.map((session) => (
                  <button
                    key={session.id}
                    className={cn(
                      "grid w-full grid-cols-[1fr_auto] gap-2 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-white",
                      session.id === activeThreadId &&
                        "bg-white shadow-[inset_2px_0_0_var(--accent)]",
                    )}
                    onClick={() => setActiveThreadId(session.id)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {session.title}
                      </span>
                      <span className="block truncate text-xs text-[var(--muted)]">
                        {session.updatedAt}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "self-start rounded px-1.5 py-0.5 text-[10px] font-medium",
                        statusStyles[session.status],
                      )}
                    >
                      {session.status}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-[var(--line)] bg-white/55 px-3 py-4 text-sm text-[var(--muted)]">
                No sessions yet.
              </div>
            )}
          </section>
        </aside>

        <CopilotChatConfigurationProvider
          agentId={agentId}
          threadId={activeThreadId}
        >
          <section className="flex min-h-[720px] min-w-0 flex-col md:h-dvh">
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line)] px-4">
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold">
                  {activeSession?.title ?? "Agent"}
                </h1>
                <p className="truncate text-xs text-[var(--muted)]">
                  {agentId} / {userId}
                </p>
              </div>
              <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-md border border-[var(--line)] bg-white px-2 text-xs font-medium text-zinc-700">
                <span className="size-2 rounded-full bg-emerald-500" />
                runtime
              </span>
            </header>
            <div className="min-h-0 flex-1 p-3 sm:p-4">
              <AgentChat threadId={activeThreadId} />
            </div>
          </section>
        </CopilotChatConfigurationProvider>
      </div>
    </main>
  );
}
