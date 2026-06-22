import { NextRequest, NextResponse } from "next/server";

import { createPresignedUpload } from "@/lib/agent-runtime";
import { buildRuntimeHeaders } from "@/lib/auth-headers";
import { extractRuntimeIdentity } from "@/lib/copilot-runtime";
import { getServerEnv } from "@/lib/env";

type UploadRequestBody = {
  objectName?: string;
  object_name?: string;
  contentType?: string;
  content_type?: string;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as UploadRequestBody;
  const objectName = body.objectName || body.object_name;

  if (!objectName) {
    return NextResponse.json(
      { error: "objectName is required" },
      { status: 400 },
    );
  }

  const upload = await createPresignedUpload(
    {
      objectName,
      contentType: body.contentType || body.content_type,
    },
    {
      runtimeUrl: getServerEnv().agentRuntimeUrl,
      headers: buildRuntimeHeaders(extractRuntimeIdentity(request.headers)),
    },
  );

  return NextResponse.json(upload);
}
