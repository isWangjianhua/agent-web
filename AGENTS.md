# AGENTS.md

本文件给编码代理提供简短、可执行的项目约定。长篇工程说明放在 `docs/`。

## 项目类型

这是四项目架构中的前端项目：

```text
agent-web        # 本项目：Next.js + assistant-ui + Vercel AI SDK 通用 chatbot 前端
agent-runtime    # AgentScope app service + AI SDK stream adapter + memory + artifacts
agent-tools-mcp  # FastMCP 业务工具服务
agent-infra      # Redis、MinIO、部署和观测
```

本项目只负责用户界面、assistant-ui / Vercel AI SDK 接入、轻量 API 代理和前端状态展示。不要在这里实现 AgentScope runtime、FastMCP server、Mem0 业务逻辑或 MinIO 持久化逻辑。

## 默认结构

新增代码优先沿用以下目录边界：

```text
src/
  app/                  # Next.js App Router 页面、layout、route handlers
    assistant.tsx       # assistant-ui minimal 模板入口
    api/chat/           # assistant-ui / AI SDK 到 agent-runtime /chat 的协议边界
    api/uploads/        # 上传 presign 代理
  components/           # 可复用 UI 组件
    assistant-ui/       # assistant-ui registry 组件
    ui/                 # shadcn UI 基础组件
  data/                 # 本地演示数据或静态 UI fixtures
  lib/                  # env、runtime client、协议映射、小工具
  types/                # 共享 TypeScript 类型
public/                 # 静态资源
```

只有当现有目录无法清晰表达职责时，才新增目录。避免创建空模板目录。

## 核心边界

- `src/app/api/chat/route.ts` 是 assistant-ui / AI SDK 的 HTTP 边界，保持薄。
- `src/lib/chat-runtime.ts` 只把 AI SDK 请求转发到 `agent-runtime /chat`，并保留 AI SDK stream headers。
- `src/lib/runtime-identity.ts` 保留身份 header 提取等可测试逻辑。
- `src/app/api/uploads/presign/route.ts` 只代理到 `agent-runtime /uploads/presign`。
- `src/app/assistant.tsx` 采用 assistant-ui minimal 模板入口，创建 runtime、AI SDK transport 和附件 adapter。
- `src/components/assistant-ui/` 使用 assistant-ui registry 组件，避免重新手写 chat UI。
- 前端只传 artifact object key、metadata、URL 引用，不传大文件 base64。

## 设计约定

- 这是通用 agent chatbot，不是 landing page。
- 默认采用 assistant-ui minimal 单线程 chat UI，不额外维护自写 session shell。
- 使用 Geist 字体、Tailwind v4、shadcn UI 和 lucide icons，assistant-ui registry 组件优先。
- 避免 AI 紫色渐变、装饰光球、营销 hero、卡片堆叠式 SaaS 首页。
- 卡片只用于单个 artifact、会话、状态项等真实重复对象；页面结构用 panel、divider、grid 组织。
- 交互控件应有稳定尺寸，移动端和桌面端文本不能溢出。

## 开发工作流

使用 `pnpm`。

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
pnpm dev
```

本地默认连接：

```bash
AGENT_RUNTIME_URL=http://127.0.0.1:8100
```

## 代码风格

- 使用 TypeScript strict，优先小函数和清晰类型。
- 行为映射优先放进 `src/lib/` 并写测试。
- Server Components 默认用于静态布局；使用 assistant-ui / Vercel AI SDK hooks、浏览器 API、动画或事件处理时使用 Client Component。
- 不要把环境变量读取散落在组件里，统一从 `src/lib/env.ts` 进入。
- 不要在浏览器端读取 server-only secret。
- UI 文案使用产品操作语言，避免解释设计、功能卖点或教程式长文案。

## API 与协议兼容性

- `agent-runtime` 当前公开 `/chat` 和 `/uploads/presign`。
- assistant-ui / AI SDK UI 请求先进入本项目 `/api/chat`，再转发到 Python AI SDK-compatible endpoint。
- 前端 route handler 或 runtime agent 负责补齐本地开发身份 header：`x-tenant-id`、`x-user-id`。
- 协议字段变化时，同步更新 `src/lib/chat-runtime.ts`、相关测试和 README。
- 错误信息应能定位问题，但不要暴露 secrets、完整 presigned URL、内部路径或堆栈。

## 测试

使用 Vitest。

- 行为变更要补测试，尤其是 route 映射、env、headers、runtime client。
- UI 结构变更至少保证 `pnpm lint` 和 `pnpm build` 通过。
- 外部服务测试不要依赖真实 MinIO、Mem0、FastMCP 或模型服务。

## 完成前

运行相关检查：

```bash
pnpm lint
pnpm test
pnpm build
```

如果只改文档，也至少运行：

```bash
git diff --check
```
