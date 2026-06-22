import {
  ActivityIcon,
  Archive,
  ClockCounterClockwise,
  Database,
  File,
  FolderOpen,
  HardDrives,
  LinkSimple,
  PlugsConnected,
  Pulse,
  SidebarSimple,
} from "@phosphor-icons/react/dist/ssr";

import { AgentChat } from "@/components/copilot/agent-chat";
import { artifacts, runtimeChecks, sessions } from "@/data/workspace";
import { cn } from "@/lib/utils";

const statusStyles = {
  idle: "bg-zinc-200 text-zinc-700",
  running: "bg-emerald-100 text-emerald-800",
  blocked: "bg-rose-100 text-rose-800",
  ready: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-900",
  uploading: "bg-blue-100 text-blue-800",
} as const;

export function AppShell() {
  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_340px]">
        <aside className="border-b border-[var(--line)] bg-[var(--surface-muted)] lg:border-b-0 lg:border-r">
          <div className="flex h-14 items-center justify-between border-b border-[var(--line)] px-4">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-md bg-zinc-950 text-white">
                <Pulse size={17} weight="bold" />
              </div>
              <div>
                <div className="text-sm font-semibold">Agent Web</div>
                <div className="text-[11px] text-[var(--muted)]">
                  local workspace
                </div>
              </div>
            </div>
            <button className="icon-button" aria-label="Toggle sidebar">
              <SidebarSimple size={18} />
            </button>
          </div>

          <nav className="space-y-1 p-3">
            {[
              ["Workspace", ActivityIcon],
              ["Sessions", ClockCounterClockwise],
              ["Artifacts", Archive],
              ["Runtime", PlugsConnected],
            ].map(([label, Icon]) => (
              <a
                key={label as string}
                href="#"
                className={cn(
                  "flex h-9 items-center gap-2 rounded-md px-2 text-sm text-zinc-700 transition-colors hover:bg-white",
                  label === "Workspace" && "bg-white font-medium text-zinc-950",
                )}
              >
                <Icon size={17} />
                {label as string}
              </a>
            ))}
          </nav>

          <section className="px-3 pb-4">
            <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
              Threads
            </div>
            <div className="divide-y divide-[var(--line)] rounded-md border border-[var(--line)] bg-white">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  className="grid w-full grid-cols-[1fr_auto] gap-2 px-3 py-3 text-left transition-colors hover:bg-zinc-50"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {session.title}
                    </span>
                    <span className="block truncate text-xs text-[var(--muted)]">
                      {session.id}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        statusStyles[session.status],
                      )}
                    >
                      {session.status}
                    </span>
                    <span className="text-[11px] text-[var(--muted)]">
                      {session.updatedAt}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="flex min-h-[720px] min-w-0 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-[var(--line)] px-4">
            <div>
              <h1 className="text-base font-semibold">Agent Workspace</h1>
              <p className="text-xs text-[var(--muted)]">
                default / local-user / default-agent
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 items-center gap-2 rounded-md border border-[var(--line)] bg-white px-2 text-xs font-medium text-zinc-700">
                <span className="size-2 rounded-full bg-emerald-500" />
                runtime
              </span>
              <button className="icon-button" aria-label="Open files">
                <FolderOpen size={18} />
              </button>
            </div>
          </header>
          <div className="min-h-0 flex-1 p-3 sm:p-4">
            <AgentChat />
          </div>
        </section>

        <aside className="border-t border-[var(--line)] bg-[var(--surface-muted)] lg:border-l lg:border-t-0">
          <div className="flex h-14 items-center justify-between border-b border-[var(--line)] px-4">
            <div>
              <div className="text-sm font-semibold">Run Context</div>
              <div className="text-xs text-[var(--muted)]">artifact + runtime</div>
            </div>
            <button className="icon-button" aria-label="Link context">
              <LinkSimple size={18} />
            </button>
          </div>

          <section className="border-b border-[var(--line)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Artifacts</h2>
              <File size={17} className="text-[var(--muted)]" />
            </div>
            <div className="space-y-2">
              {artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="rounded-md border border-[var(--line)] bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {artifact.name}
                      </div>
                      <div className="mt-1 truncate font-mono text-[11px] text-[var(--muted)]">
                        {artifact.objectKey}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
                        statusStyles[artifact.status],
                      )}
                    >
                      {artifact.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-b border-[var(--line)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Runtime</h2>
              <HardDrives size={17} className="text-[var(--muted)]" />
            </div>
            <div className="divide-y divide-[var(--line)] rounded-md border border-[var(--line)] bg-white">
              {runtimeChecks.map((check) => (
                <div
                  key={check.label}
                  className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2.5"
                >
                  <div>
                    <div className="text-sm font-medium">{check.label}</div>
                    <div className="text-xs text-[var(--muted)]">
                      {check.value}
                    </div>
                  </div>
                  <span className="self-center rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700">
                    {check.state}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Memory Scope</h2>
              <Database size={17} className="text-[var(--muted)]" />
            </div>
            <div className="rounded-md border border-[var(--line)] bg-white p-3">
              <dl className="grid grid-cols-[90px_1fr] gap-y-2 text-xs">
                <dt className="text-[var(--muted)]">tenant</dt>
                <dd className="font-mono">default</dd>
                <dt className="text-[var(--muted)]">user</dt>
                <dd className="font-mono">local-user</dd>
                <dt className="text-[var(--muted)]">store</dt>
                <dd className="font-mono">Mem0</dd>
              </dl>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
