import { describe, expect, it } from "vitest";

import {
  buildRuntimeHeaders,
  buildRuntimeIdentityHeaders,
} from "./auth-headers";

describe("buildRuntimeHeaders", () => {
  it("forwards tenant and user identity headers", () => {
    const headers = buildRuntimeHeaders({
      userId: "u1",
      tenantId: "t1",
    });

    expect(headers).toEqual({
      "content-type": "application/json",
      "x-tenant-id": "t1",
      "x-user-id": "u1",
    });
  });

  it("builds identity-only headers for clients that set content-type themselves", () => {
    const headers = buildRuntimeIdentityHeaders({
      userId: "u1",
      tenantId: "t1",
    });

    expect(headers).toEqual({
      "x-tenant-id": "t1",
      "x-user-id": "u1",
    });
  });
});
