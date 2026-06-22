"use client";

import {
  ArrowClockwise,
  Copy,
  Paperclip,
  PaperPlaneTilt,
  Stop,
  ThumbsDown,
  ThumbsUp,
} from "@phosphor-icons/react";
import { CopilotChat, type AttachmentsConfig } from "@copilotkit/react-ui";

async function uploadAttachment(file: File) {
  const response = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-tenant-id": "default",
      "x-user-id": "local-user",
    },
    body: JSON.stringify({
      objectName: file.name,
      contentType: file.type || "application/octet-stream",
    }),
  });

  if (!response.ok) {
    throw new Error(`presign failed: ${response.status}`);
  }

  const upload = (await response.json()) as {
    uploadUrl: string | null;
    objectKey: string;
  };

  if (upload.uploadUrl) {
    const putResponse = await fetch(upload.uploadUrl, {
      method: "PUT",
      headers: {
        "content-type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!putResponse.ok) {
      throw new Error(`upload failed: ${putResponse.status}`);
    }
  }

  return {
    type: "url" as const,
    value: upload.uploadUrl || `/artifacts/${encodeURIComponent(upload.objectKey)}`,
    mimeType: file.type || "application/octet-stream",
    metadata: {
      objectKey: upload.objectKey,
      storage: upload.uploadUrl ? "minio" : "runtime-reference",
    },
  };
}

const attachments: AttachmentsConfig = {
  enabled: true,
  accept: "image/*,application/pdf,text/plain,application/json",
  maxSize: 20 * 1024 * 1024,
  onUpload: uploadAttachment,
};

export function AgentChat() {
  return (
    <div className="agent-chat">
      <CopilotChat
        className="agent-chat__surface"
        attachments={attachments}
        icons={{
          sendIcon: <PaperPlaneTilt size={20} weight="bold" />,
          stopIcon: <Stop size={18} weight="bold" />,
          regenerateIcon: <ArrowClockwise size={16} weight="bold" />,
          uploadIcon: <Paperclip size={20} weight="bold" />,
          copyIcon: <Copy size={16} weight="bold" />,
          thumbsUpIcon: <ThumbsUp size={16} weight="bold" />,
          thumbsDownIcon: <ThumbsDown size={16} weight="bold" />,
        }}
        labels={{
          title: "Agent",
          initial: "连接到本地 agent-runtime 后，可以直接发起任务。",
          placeholder: "输入任务、粘贴上下文或上传文件",
          error: "运行失败，请检查 agent-runtime。",
          stopGenerating: "停止",
          regenerateResponse: "重新生成",
          copyToClipboard: "复制",
          copied: "已复制",
          thumbsUp: "认可",
          thumbsDown: "否决",
        }}
        suggestions={[
          {
            title: "报价",
            message: "根据已上传的零件资料生成报价分析。",
          },
          {
            title: "图纸",
            message: "提取图纸关键尺寸和制造约束。",
          },
          {
            title: "工具",
            message: "列出当前 FastMCP 可用工具和用途。",
          },
        ]}
      />
    </div>
  );
}
