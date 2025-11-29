import { MessagesProps } from '@copilotkit/react-ui';
import {
    FunctionResponseRenderer,
    parseFunctionResponse,
} from '../actions/FunctionResponseRenderer';

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
                    />
                );
            })}
        </div>
    );
}
