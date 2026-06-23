"use client";

import { CopilotChat, type AttachmentsConfig } from "@copilotkit/react-core/v2";

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
        agentId="default"
        className="agent-chat__surface"
        attachments={attachments}
        labels={{
          chatInputPlaceholder: "输入任务、粘贴上下文或上传文件",
          chatInputToolbarAddButtonLabel: "上传文件",
          chatInputToolbarToolsButtonLabel: "工具",
          assistantMessageToolbarCopyMessageLabel: "复制",
          assistantMessageToolbarCopyCodeLabel: "复制代码",
          assistantMessageToolbarCopyCodeCopiedLabel: "已复制",
          assistantMessageToolbarThumbsUpLabel: "认可",
          assistantMessageToolbarThumbsDownLabel: "否决",
          assistantMessageToolbarRegenerateLabel: "重新生成",
          userMessageToolbarCopyMessageLabel: "复制",
          modalHeaderTitle: "Agent",
          welcomeMessageText: "连接到本地 agent-runtime 后，可以直接发起任务。",
        }}
      />
    </div>
  );
}
