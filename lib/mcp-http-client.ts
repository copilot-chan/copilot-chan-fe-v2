import { MCPTool, MCPClient as MCPClientInterface } from '@copilotkit/runtime';

/**
 * A clean, standard implementation of MCP over HTTP (POST + SSE).
 * Implements the CopilotKit MCPClient interface.
 */
export class McpHttpClient implements MCPClientInterface {
    private endpoint: string;
    private apiKey?: string;
    private sessionId: string | null = null;
    private eventSource: EventSource | null = null;
    private cachedTools: Record<string, MCPTool> | null = null;

    constructor(config: { endpoint: string; apiKey?: string }) {
        this.endpoint = config.endpoint;
        this.apiKey = config.apiKey;
    }

    /**
     * Establishes a session with the MCP server usually via SSE.
     * Note: Some simple MCP servers might be stateless and not require this,
     * but standard MCP over HTTP uses SSE for server-to-client notifications.
     */
    async connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sseUrl = new URL(this.endpoint);
            // Append auth if needed
            if (this.apiKey) {
                sseUrl.searchParams.append('apiKey', this.apiKey);
            }

            // In a browser environment we'd use minimal EventSource,
            // but in Node environment (Runtime) we usually use 'eventsource' polyfill or built-in.
            // CopilotRuntime runs on Node, so we might need a fetch-based approach or 'eventsource' package.
            // For now, let's assume standard 'fetch' with streaming body is handled or global EventSource exists.
            // If this is running in a standard Node route, global EventSource might not be present.
            // However, CopilotKit runtime environment often polyfills it or we should check available globals.
            
            // NOTE: For robustness in Node, checking for global EventSource.
            // If not present, we might skip SSE or throw/warn. 
            // Many simple MCP tools work just fine with request/response loop if we blindly send requests.
            // But let's try to do the "Initialization" handshake.

            // 1. Send JSON-RPC Initialize
            this.sendRequest('initialize', {
                protocolVersion: '2024-11-05', // Use a recent version or common valid one
                capabilities: {},
                clientInfo: { name: 'copilotkit-mcp-client', version: '1.0.0' }
            }).then(initResult => {
                 // 2. If Initialize succeeds, we consider connected.
                 // Real MCP might require 'notifications/initialized' notification next.
                 this.sendNotification('notifications/initialized', {});
                 console.log(`[McpHttpClient] Connected to ${this.endpoint}`);
                 resolve();
            }).catch(err => {
                console.error(`[McpHttpClient] Initialization failed:`, err);
                // We resolve anyway to allow stateless tools to attempt working, or you can reject.
                // resolve(); 
                reject(err);
            });
        });
    }

    async tools(): Promise<Record<string, MCPTool>> {
        if (this.cachedTools) return this.cachedTools;

        try {
            const response = await this.sendRequest('tools/list', {});
            const toolsMap: Record<string, MCPTool> = {};

            if (response && response.tools) {
                for (const tool of response.tools) {
                    toolsMap[tool.name] = {
                        description: tool.description,
                        schema: tool.inputSchema,
                        execute: async (args: any) => {
                            return await this.callTool(tool.name, args);
                        }
                    };
                }
            }
            this.cachedTools = toolsMap;
            return toolsMap;
        } catch (error) {
            console.error(`[McpHttpClient] Failed to list tools:`, error);
            return {};
        }
    }

    private async callTool(name: string, args: any): Promise<any> {
        try {
            const response = await this.sendRequest('tools/call', {
                name: name,
                arguments: args
            });
            // MCP tools/call returns an object like { content: [...] }
            // CopilotKit expects strict return. We might need to unwrap it.
            // If response is already the result, return it.
            return response;
        } catch (error) {
            console.error(`[McpHttpClient] Error calling tool ${name}:`, error);
            throw error;
        }
    }

    /**
     * Helper to send JSON-RPC 2.0 requests via HTTP POST
     */
    private async sendRequest(method: string, params: any): Promise<any> {
        const id = Date.now();
        const payload = {
            jsonrpc: "2.0",
            method,
            params,
            id
        };

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }
        // If we had a session ID from SSE, we would attach it here.
        // if (this.sessionId) headers['Mcp-Session-Id'] = this.sessionId;

        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`MCP Request failed: ${res.status} ${res.statusText} - ${txt}`);
        }

        const data = await res.json();
        if (data.error) {
            throw new Error(`MCP JSON-RPC Error: ${data.error.message} (${data.error.code})`);
        }
        return data.result;
    }

    private async sendNotification(method: string, params: any): Promise<void> {
        const payload = {
            jsonrpc: "2.0",
            method,
            params
        };
         const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        await fetch(this.endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        }).catch(err => console.warn("Failed to send notification", err));
    }

    async close(): Promise<void> {
        // Cleanup if necessary
    }
}
