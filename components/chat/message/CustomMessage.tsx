import { MessagesProps, Markdown } from '@copilotkit/react-ui';
import { useEffect, useRef } from 'react';
import { CustomCodeBlock } from './CustomCodeBlock';
import { UIMessage, UIToolCallMessage, UIToolResultMessage } from '@/lib/chat';
import { TextMessage } from './TextMessage';
import { ToolMessage } from './ToolMessage';
import { CustomUserMessage } from './CustomUserMessage';

interface CustomMessagesProps extends MessagesProps {
    initialMessages?: UIMessage[];
}

function renderHistoryMessage(msg: UIMessage, index: number) {
    // console.log("[renderHistoryMessage] msg", msg);
    switch (msg.kind) {
        case 'text':
            return <TextMessage key={`history-${index}`} msg={msg} />;
        case 'tool':
            return <ToolMessage key={`history-${index}`} msg={msg as UIToolCallMessage | UIToolResultMessage} />;
        default:
            return null;
    }
}

export function CustomMessages({
    messages,
    inProgress,
    RenderMessage,
    initialMessages = [],
}: CustomMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const totalCount = initialMessages.length + messages.length;
    console.log("[CustomMessages] totalCount", totalCount);
    // console.log("[CustomMessages] initialMessages", initialMessages);
    // console.log("[CustomMessages] messages", messages);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [totalCount, inProgress]);

    return (
        <div className="flex flex-col gap-2 copilotKitMessages h-full overflow-y-auto p-4">
            {/* Section 1: History messages from API (typed UIMessage[]) */}
            {/* {initialMessages.map((msg, index) => renderHistoryMessage(msg, index))}
            {`console.log("[CustomMessages] initialMessages", ${initialMessages.length});`} */}

            {/* Section 2: Realtime messages from CopilotKit (typed Message[]) */}
            {messages.map((message, index) => {
                const globalIndex = initialMessages.length + index;
                const isCurrentMessage = globalIndex === totalCount - 1;

                return (
                    <RenderMessage
                        key={`realtime-${index}`}
                        message={message}
                        inProgress={inProgress}
                        index={index}
                        isCurrentMessage={isCurrentMessage}
                        messages={messages}
                        markdownTagRenderers={{
                            code: CustomCodeBlock,
                        }}
                        UserMessage={CustomUserMessage}
                    />
                );
            })}

            {/* Invisible element for auto-scroll */}
            <div ref={messagesEndRef} />
        </div>
    );
}
