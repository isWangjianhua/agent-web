"use client";

import { CopilotKit } from "@copilotkit/react-core";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      headers={{
        "x-tenant-id": "default",
        "x-user-id": "local-user",
      }}
    >
      {children}
    </CopilotKit>
  );
}
