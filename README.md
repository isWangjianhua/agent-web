# Agent Web

Next.js + assistant-ui + Vercel AI SDK 通用 chatbot 前端，属于四项目 agent 架构里的 UI 项目。

```text
agent-web        # assistant-ui + AI SDK 通用 chatbot 前端
agent-runtime    # AgentScope app service + AI SDK stream adapter
agent-tools-mcp  # FastMCP 业务工具服务
agent-infra      # Redis、MinIO、部署和观测
```

## 本地启动

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

默认连接本地 runtime：

```bash
AGENT_RUNTIME_URL=http://127.0.0.1:8100
```

## 目录

```text
src/app/                  # App Router 页面和 route handlers
src/app/assistant.tsx     # assistant-ui runtime + default/base shell 入口
src/app/api/chat/         # assistant-ui / AI SDK -> agent-runtime /chat 边界
src/app/api/uploads/      # MinIO presign 代理
src/components/assistant-ui/ # assistant-ui registry 组件
src/components/ui/        # shadcn UI 基础组件
src/lib/                  # env、headers、runtime client、协议映射
```

assistant-ui 通过 AI SDK transport 请求 `/api/chat`，再由薄 route handler 转发到 `agent-runtime /chat`。UI 层复用 assistant-ui 官方 default/base shell 和 registry 组件，不维护自写 chat/session shell。

## 检查

```bash
pnpm lint
pnpm test
pnpm build
```
