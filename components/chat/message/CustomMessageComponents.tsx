import { MessagesProps } from '@copilotkit/react-ui';
import { useEffect, useRef } from 'react';
import {
    FunctionResponseRenderer,
    parseFunctionResponse,
} from '../actions/FunctionResponseRenderer';
import { CustomCodeBlock } from './CustomCodeBlock';

interface CustomMessagesProps extends MessagesProps {
    initialMessages?: any[];
}

export function CustomMessages({
    messages,
    inProgress,
    RenderMessage,
    initialMessages = [],
}: CustomMessagesProps) {
    const allMessages = [...initialMessages, ...messages];
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [allMessages.length, inProgress]);

    return (
        <div className="flex flex-col gap-2 copilotKitMessages h-full overflow-y-auto p-4">
            {allMessages.map((message, index) => {
                const isCurrentMessage = index === allMessages.length - 1;

                // Try parse as functionResponse
                const content = (message as { content?: string }).content;
                if (typeof content === 'string') {
                    const functionResponseData = parseFunctionResponse(content);

                    if (functionResponseData) {
                        return (
                            <div
                                key={index}
                                className="flex justify-start mb-2"
                            >
                                <FunctionResponseRenderer
                                    data={functionResponseData}
                                />
                            </div>
                        );
                    }
                }

                // Default rendering
                return (
                    <RenderMessage
                        key={index}
                        message={message}
                        inProgress={inProgress}
                        index={index}
                        isCurrentMessage={isCurrentMessage}
                        markdownTagRenderers={{
                            code: CustomCodeBlock,
                        }}
                    />
                );
            })}
            {/* Invisible element at the end to scroll to */}
            <div ref={messagesEndRef} />
        </div>
    );
}
