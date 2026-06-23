import { describe, expect, it } from "vitest";

import { extractRuntimeIdentity } from "./runtime-identity";

describe("extractRuntimeIdentity", () => {
  it("extracts local development identity headers", () => {
    const headers = new Headers({
      "x-user-id": "u1",
      "x-tenant-id": "t1",
    });

    expect(extractRuntimeIdentity(headers)).toEqual({
      userId: "u1",
      tenantId: "t1",
    });
  });
});
