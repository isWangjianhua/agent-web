"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      useSingleEndpoint={false}
      headers={{
        "x-tenant-id": "default",
        "x-user-id": "local-user",
      }}
    >
      {children}
    </CopilotKit>
  );
}
