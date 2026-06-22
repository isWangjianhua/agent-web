import { describe, expect, it, vi } from "vitest";

import { createPresignedUpload } from "./agent-runtime";

describe("createPresignedUpload", () => {
  it("posts object metadata to the runtime upload endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        bucket: "agent-runtime",
        object_key: "t1/u1/input.pdf",
        upload_url: null,
        configured: false,
      }),
    });

    const result = await createPresignedUpload(
      {
        objectName: "input.pdf",
        contentType: "application/pdf",
      },
      {
        runtimeUrl: "http://runtime",
        headers: {
          "x-user-id": "u1",
          "x-tenant-id": "t1",
        },
        fetcher: fetchMock,
      },
    );

    expect(fetchMock).toHaveBeenCalledWith("http://runtime/uploads/presign", {
      body: JSON.stringify({
        object_name: "input.pdf",
        content_type: "application/pdf",
      }),
      headers: {
        "content-type": "application/json",
        "x-tenant-id": "t1",
        "x-user-id": "u1",
      },
      method: "POST",
    });
    expect(result.objectKey).toBe("t1/u1/input.pdf");
  });
});

