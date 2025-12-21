'use client';
import { useState } from 'react';
import { useCopilotChatHeadless_c } from '@copilotkit/react-core';

export default function TestFullyHeadlessUI() {
    const { messages, sendMessage, isLoading } = useCopilotChatHeadless_c({
        initialMessages:[
            {
                id: '1',
                role: 'assistant',
                content: 'Hello! How can I help you today?',
            },
        ]
    });
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            sendMessage({
                id: Date.now().toString(),
                role: 'user',
                content: input,
            });
            setInput('');
        }
    };

    function renderContent(content: any): React.ReactNode {
        if (!content) {
            return null;
        }

        if (typeof content === 'string') {
            return content;
        }

        if (Array.isArray(content)) {
            return content.map((block, i) => {

                if (block.type === 'text') {
                    return <span key={i}>{block.text}</span>;
                }

                //User messages
                if (block.type === 'binary') {
                    return (
                        <a
                            key={i}
                            href={block.url}
                            download={block.filename}
                            target="_blank"
                        >
                            {block.filename ?? block.mimeType}
                        </a>
                    );
                }

                return null
            });

        }
        return (
            <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(content, null, 2)}
            </pre>
        )
    }

    return (
        <div>
            <h1>My Headless Chat</h1>

            {/* Messages */}
            <div>
                {messages.map((message) => (
                    <div key={message.id}>
                        <strong>
                            {message.role === 'user' ? 'You' : 'Assistant'}:
                        </strong>
                        <p>{renderContent(message.content)}</p>
                    </div>
                ))}

                {isLoading && <p>Assistant is typing...</p>}
            </div>

            {/* Input */}
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message here..."
                />
                <button onClick={handleSend} disabled={isLoading}>
                    Send
                </button>
            </div>
        </div>
    );
}
