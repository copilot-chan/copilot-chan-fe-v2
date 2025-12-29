'use client';

import { CopilotChat, CopilotKitCSSProperties } from '@copilotkit/react-ui';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useMemo } from 'react';
import { CustomMessages } from './message/CustomMessage';
import { useChatLogic } from '@/hooks/useChatLogic';
import { CustomCodeBlock } from './message/CustomCodeBlock';
import { YoutubeEmbed } from './media/youtube';
import { CustomUserMessage } from './message/CustomUserMessage';

const CHAT_LABELS = {
    title: 'Copilot Chan',
    initial: 'Hi! How can I help you today?',
};

const CHAT_INSTRUCTIONS = 'You are a helpful AI assistant.';

export function ChatInterface({ chatId }: { chatId?: string }) {
    const { isLoading, handleMessageSent, initialMessages, sessionId } =useChatLogic();


    // Wrapper for CustomMessages to merge history
    // const MessagesWrapper = useMemo(() => {
    //     return (props: any) => (
    //         <CustomMessages {...props} initialMessages={initialMessages} />
    //     );
    // }, [initialMessages]);

    if (isLoading && sessionId) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
                <LoadingSpinner text="Loading conversation..." />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground">
            <div
                className="flex-1 overflow-hidden relative"
                style={
                    {
                        '--copilot-kit-primary-color': 'var(--primary)',
                        '--copilot-kit-background-color': 'var(--background)',
                        '--copilot-kit-response-button-background-color':
                            'var(--secondary)',
                        '--copilot-kit-response-button-color':
                            'var(--secondary-foreground)',
                        '--copilot-kit-separator-color': 'var(--border)',
                        '--copilot-kit-contrast-color':
                            'var(--card-foreground)',
                        

                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        borderRadius: '10px',
                    } as CopilotKitCSSProperties
                }
            >
                <CopilotChat
                    key={sessionId}
                    instructions={CHAT_INSTRUCTIONS}
                    labels={CHAT_LABELS}
                    className="h-full w-full"
                    onSubmitMessage={handleMessageSent}
                    markdownTagRenderers={
                        {
                            code: CustomCodeBlock,
                            a: YoutubeEmbed
                        }
                    }
                    UserMessage={CustomUserMessage}
                    

                    // Messages={MessagesWrapper}
                />
            </div>
        </div>
    );
}
