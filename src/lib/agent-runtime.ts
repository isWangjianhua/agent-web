import { buildRuntimeHeaders } from "./auth-headers";

export type PresignedUploadInput = {
  objectName: string;
  contentType?: string;
};

export type PresignedUpload = {
  bucket: string;
  objectKey: string;
  uploadUrl: string | null;
  configured: boolean;
};

type RuntimeRequestOptions = {
  runtimeUrl: string;
  headers?: Record<string, string>;
  fetcher?: typeof fetch;
};

type PresignedUploadResponse = {
  bucket: string;
  object_key: string;
  upload_url: string | null;
  configured: boolean;
};

export async function createPresignedUpload(
  input: PresignedUploadInput,
  options: RuntimeRequestOptions,
): Promise<PresignedUpload> {
  const fetcher = options.fetcher || fetch;
  const response = await fetcher(`${options.runtimeUrl}/uploads/presign`, {
    method: "POST",
    headers: {
      ...buildRuntimeHeaders(),
      ...options.headers,
    },
    body: JSON.stringify({
      object_name: input.objectName,
      content_type: input.contentType,
    }),
  });

  if (!response.ok) {
    throw new Error(`Upload presign failed with status ${response.status}`);
  }

  const payload = (await response.json()) as PresignedUploadResponse;
  return {
    bucket: payload.bucket,
    objectKey: payload.object_key,
    uploadUrl: payload.upload_url,
    configured: payload.configured,
  };
}

