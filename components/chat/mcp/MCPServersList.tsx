'use client';

import { useCopilotChat } from '@copilotkit/react-core';

export default function MCPServersList() {
    const { mcpServers } = useCopilotChat();

    return (
        <div className="m-5 bg-red-500">
            list:
            {Object.entries(mcpServers).map(([endpoint, server]) => (
                <div key={endpoint}>
                    <h1>{endpoint}</h1>
                </div>
            ))}
        </div>
    );
}
