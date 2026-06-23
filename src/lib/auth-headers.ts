export type RuntimeIdentity = {
  userId?: string;
  tenantId?: string;
};

export function buildRuntimeIdentityHeaders(
  identity: RuntimeIdentity = {},
): Record<string, string> {
  return {
    "x-tenant-id": identity.tenantId || "default",
    "x-user-id": identity.userId || "local-user",
  };
}

export function buildRuntimeHeaders(
  identity: RuntimeIdentity = {},
): Record<string, string> {
  return {
    "content-type": "application/json",
    ...buildRuntimeIdentityHeaders(identity),
  };
}
