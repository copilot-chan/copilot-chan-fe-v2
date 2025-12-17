'use client';

import { useCopilotChatHeadless_c } from '@copilotkit/react-core';
import { useEffect } from 'react';

interface RegisterMCPServerProps {
    serverURL?: string;
    apiKey?: string;
}

export default function RegisterMCPServer() {
    const { mcpServers, setMcpServers } = useCopilotChatHeadless_c();

    useEffect(() => {
        console.log('[MCP server] register');
        setMcpServers([
            {
                endpoint: 'http://localhost:3000/mcp',
            },
        ]);
    }, [setMcpServers]);

    useEffect(() => {
        console.log('[MCP servers changed]', mcpServers);
    }, [mcpServers]);

    return <div className="bg-red-300 m-20">RegisterMCPServer</div>;
}
