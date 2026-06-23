import { NextRequest } from "next/server";

import { buildRuntimeHeaders } from "@/lib/auth-headers";
import { streamChatFromRuntime } from "@/lib/chat-runtime";
import { getServerEnv } from "@/lib/env";
import { extractRuntimeIdentity } from "@/lib/runtime-identity";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json();

  return streamChatFromRuntime({
    runtimeUrl: getServerEnv().agentRuntimeUrl,
    body,
    headers: buildRuntimeHeaders(extractRuntimeIdentity(request.headers)),
  });
}
