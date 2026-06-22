import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { buildRuntimeHeaders } from "./auth-headers";
import { getServerEnv } from "./env";

const runtime = new CopilotRuntime({
  agents: {
    default: new HttpAgent({
      url: `${getServerEnv().agentRuntimeUrl}/agui/run`,
      headers: buildRuntimeHeaders(),
    }),
  },
});

export const copilotHandler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});
