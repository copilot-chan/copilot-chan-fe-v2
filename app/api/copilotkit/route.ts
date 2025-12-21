import {
    CopilotRuntime,
    ExperimentalEmptyAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import {BasicAgent}from '@copilotkit/runtime/v2'
import { HttpAgent } from '@ag-ui/client';
import { NextRequest } from 'next/server';
import { McpHttpClient } from '@/lib/mcp-http-client';

// 1. You can use any service adapter here for multi-agent support. We use
//    the empty adapter since we're only using one agent.
const serviceAdapter = new ExperimentalEmptyAdapter();

// 2. Create the CopilotRuntime instance and utilize the ADK AG-UI
//    integration to setup the connection.
const chatAgentUrl =
    process.env.CHAT_AGENT_URL || 'http://localhost:8000/ag-ui/api/chat';

const runtime = new CopilotRuntime({
    agents: {
        chat_agent: new HttpAgent({ url: chatAgentUrl }),
    },
    mcpServers: [
        {
            endpoint: process.env.MCP_SERVER_URL || 'http://localhost:8000/mcp',
            apiKey: process.env.MCP_SERVER_KEY,
        }
    ],
    createMCPClient: async (config) => {
        const client = new McpHttpClient({
            endpoint: config.endpoint,
            apiKey: config.apiKey,
        });
        await client.connect();
        console.log("MCP client connected to", config.endpoint);
        return client;
    },
});

// 3. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
        runtime,
        serviceAdapter,
        endpoint: '/api/copilotkit',
    });

    return handleRequest(req);
};



// export const POST = async (req: NextRequest) => {
//   // Read raw body for inspection
//   const bodyText = await req.text();
//   try {
//     const parsed = JSON.parse(bodyText);
//     console.log("Incoming /api/copilotkit body:", JSON.stringify(parsed, null, 2));
//     // If present, log mcpServers
//     if (parsed?.variables?.data?.mcpServers) {
//       console.log("mcpServers in request:", parsed.variables.data.mcpServers);
//     }
//   } catch (e) {
//     console.log("Request body not JSON or parse error:", e);
//   }

//   // Recreate a Request to avoid body already-read problems
//   const forwardedReq = new Request(req.url, {
//     method: req.method,
//     headers: Object.fromEntries(req.headers.entries()),
//     body: bodyText,
//   });

//   const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
//     runtime,
//     serviceAdapter,
//     endpoint: "/api/copilotkit",
//   });

//   return handleRequest(forwardedReq as unknown as NextRequest);
// };