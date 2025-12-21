import { MCPTool, MCPClient as MCPClientInterface } from '@copilotkit/runtime';

/**
 * HTTP Stream Transport client implementation for MCP
 * Based on the MCP specification version 2025-03-26
 *
 * This implementation supports both:
 * - Pure HTTP Stream Transport (JSON responses)
 * - Hybrid SSE/HTTP servers (SSE-formatted responses)
 *
 * Many current MCP servers use a hybrid approach where they accept
 * HTTP POST requests but respond with SSE format. This client handles
 * both response formats automatically.
 */
export class HttpStreamClient implements MCPClientInterface {
    private baseUrl: string;
    private sessionId: string | null = null;
    private eventSource: EventSource | null = null;
    private headers: Record<string, string>;
    private toolsCache: Record<string, MCPTool> | null = null;

    constructor(options: {
        serverUrl: string;
        headers?: Record<string, string>;
    }) {
        this.baseUrl = options.serverUrl;
        this.headers = options.headers || {};
    }

    async connect(): Promise<void> {
        // Initialize connection
        const initRequest = {
            jsonrpc: '2.0',
            id: 'init-' + Date.now(),
            method: 'initialize',
            params: {
                protocolVersion: '2025-03-26',
                capabilities: {},
                clientInfo: {
                    name: 'cpk-http-client',
                    version: '1.0.0',
                },
            },
        };

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/event-stream',
                ...this.headers,
            },
            body: JSON.stringify(initRequest),
        });

        // Handle SSE response format
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/event-stream')) {
            // Parse SSE response
            const text = await response.text();
            const lines = text.split('\n');
            const dataLine = lines.find((line) => line.startsWith('data:'));
            if (dataLine) {
                responseData = JSON.parse(dataLine.substring(5).trim());
            }
        } else {
            responseData = await response.json();
        }

        // Store session ID
        this.sessionId = response.headers.get('Mcp-Session-Id');
        console.log(this.sessionId)

        // Open SSE stream for server messages (only if we have a session)
        if (this.sessionId) {
            this.openEventStream();
        }

        console.log(`Connected with session: ${this.sessionId}`);
    }

    private async openEventStream() {
        if (!this.sessionId) return;
        
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                Accept: 'text/event-stream',
                'Mcp-Session-Id': this.sessionId,
                ...this.headers,
            },
            body: '', // hoặc JSON rỗng nếu server yêu cầu
        });

        if (!response.ok) {
            console.error(
                'SSE connection failed:',
                response.status,
                response.statusText
            );
            // setTimeout(() => this.openEventStream(), 1000);
            return;
        }

        if (!response.body) {
            throw new Error('SSE stream has no body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const pump = async () => {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    console.warn('SSE stream closed. Reconnecting in 1s...');
                    setTimeout(() => this.openEventStream(), 1000);
                    break;
                }

                const text = decoder.decode(value, { stream: true });
                buffer += text;

                let idx;
                while ((idx = buffer.indexOf('\n\n')) !== -1) {
                    const raw = buffer.slice(0, idx);
                    buffer = buffer.slice(idx + 2);

                    const dataLine = raw
                        .split('\n')
                        .find((l) => l.startsWith('data:'));
                    if (!dataLine) continue;

                    try {
                        const event = JSON.parse(dataLine.slice(5).trim());
                        console.log('SSE event:', event);
                    } catch (e) {
                        console.error('Failed to parse SSE:', e);
                    }
                }
            }
        };

        pump();
    }

    async tools(): Promise<Record<string, MCPTool>> {
        if (this.toolsCache) return this.toolsCache;

        const request = {
            jsonrpc: '2.0',
            id: 'tools-' + Date.now(),
            method: 'tools/list',
            params: {},
        };

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/event-stream',
                'Mcp-Session-Id': this.sessionId!,
                ...this.headers,
            },
            body: JSON.stringify(request),
        });

        // Handle SSE response format
        let result;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/event-stream')) {
            // Parse SSE response
            const text = await response.text();
            const lines = text.split('\n');
            const dataLine = lines.find((line) => line.startsWith('data:'));
            if (dataLine) {
                result = JSON.parse(dataLine.substring(5).trim());
            }
        } else {
            result = await response.json();
        }
        const toolsMap: Record<string, MCPTool> = {};

        if (result.result?.tools) {
            for (const tool of result.result.tools) {
                toolsMap[tool.name] = {
                    description: tool.description,
                    schema: tool.inputSchema,
                    execute: async (args: any) =>
                        this.callTool(tool.name, args),
                };
            }
        }

        this.toolsCache = toolsMap;
        return toolsMap;
    }

    private async callTool(name: string, args: any): Promise<any> {
        const request = {
            jsonrpc: '2.0',
            id: `tool-${name}-${Date.now()}`,
            method: 'tools/call',
            params: {
                name: name,
                arguments: args,
            },
        };

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/event-stream',
                'Mcp-Session-Id': this.sessionId!,
                ...this.headers,
            },
            body: JSON.stringify(request),
        });

        // Handle SSE response format
        let result;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/event-stream')) {
            // Parse SSE response
            const text = await response.text();
            const lines = text.split('\n');
            const dataLine = lines.find((line) => line.startsWith('data:'));
            if (dataLine) {
                result = JSON.parse(dataLine.substring(5).trim());
            }
        } else {
            result = await response.json();
        }
        return result.result;
    }

    async close(): Promise<void> {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }

        if (this.sessionId) {
            await fetch(this.baseUrl, {
                method: 'DELETE',
                headers: {
                    'Mcp-Session-Id': this.sessionId,
                    ...this.headers,
                },
            });
            this.sessionId = null;
        }
    }
}
