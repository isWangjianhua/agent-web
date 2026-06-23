"use client";

import {
  AssistantRuntimeProvider,
  type AttachmentAdapter,
  type CompleteAttachment,
  type PendingAttachment,
  type ThreadUserMessagePart,
} from "@assistant-ui/react";
import {
  AssistantChatTransport,
  useChatRuntime,
} from "@assistant-ui/react-ai-sdk";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";

import { Thread } from "@/components/assistant-ui/thread";

const localRuntimeHeaders = {
  "x-tenant-id": "default",
  "x-user-id": "local-user",
};

const attachmentAdapter: AttachmentAdapter = {
  accept: "image/*,application/pdf,text/plain,application/json",

  async add({ file }) {
    return {
      id: createAttachmentId(),
      type: inferAttachmentType(file),
      name: file.name,
      contentType: file.type || "application/octet-stream",
      file,
      status: {
        type: "requires-action",
        reason: "composer-send",
      },
    };
  },

  async remove() {},

  async send(attachment: PendingAttachment): Promise<CompleteAttachment> {
    const file = attachment.file;
    const response = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...localRuntimeHeaders,
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
      const uploadResponse = await fetch(upload.uploadUrl, {
        method: "PUT",
        headers: {
          "content-type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`upload failed: ${uploadResponse.status}`);
      }
    }

    const content: ThreadUserMessagePart[] = [
      {
        type: "file",
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        data: `/artifacts/${encodeURIComponent(upload.objectKey)}`,
      },
    ];

    return {
      ...attachment,
      file: undefined,
      content,
      status: {
        type: "complete",
      },
    };
  },
};

export function Assistant() {
  const runtime = useChatRuntime({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: new AssistantChatTransport({
      api: "/api/chat",
      headers: localRuntimeHeaders,
    }),
    adapters: {
      attachments: attachmentAdapter,
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-dvh">
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
}

function inferAttachmentType(file: File): PendingAttachment["type"] {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type === "application/pdf" || file.type.startsWith("text/")) {
    return "document";
  }

  return "file";
}

function createAttachmentId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}
