# assistant-ui Starter

This is an assistant-ui default starter wired to the local `agent-runtime`
through the Next.js `/api/chat` route.

## Getting Started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The frontend proxies chat requests to:

```bash
AGENT_RUNTIME_URL=http://127.0.0.1:8100
```

## Checks

```bash
pnpm lint
pnpm test
pnpm build
```
