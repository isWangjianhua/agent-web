import type { RuntimeIdentity } from "./auth-headers";

export function extractRuntimeIdentity(headers: Headers): RuntimeIdentity {
  return {
    userId: headers.get("x-user-id") || undefined,
    tenantId: headers.get("x-tenant-id") || undefined,
  };
}
