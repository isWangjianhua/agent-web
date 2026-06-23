# Agent Web

Next.js + CopilotKit 通用 chatbot 前端，属于四项目 agent 架构里的 UI 项目。

```text
agent-web        # CopilotKit 通用 chatbot 前端
agent-runtime    # AgentScope app service + AG-UI adapter
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
src/app/api/copilotkit/   # CopilotKit Runtime -> agent-runtime AG-UI 边界
src/app/api/uploads/      # MinIO presign 代理
src/components/copilot/   # CopilotKit chat 封装
src/components/workspace/ # 两栏 chatbot 布局和 session history
src/lib/                  # env、headers、runtime client、协议映射
src/types/                # 共享类型
```

CopilotKit UI 请求进入 `/api/copilotkit/*`，由 `@copilotkit/runtime` 的 `CopilotRuntime + HttpAgent` 转发到 `agent-runtime /agui/run`。

## 检查

```bash
pnpm lint
pnpm test
pnpm build
```
