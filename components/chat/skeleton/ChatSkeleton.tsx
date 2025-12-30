'use client';

import { cn } from '@/lib/utils';

interface ChatSkeletonProps {
    messageCount?: number;
    className?: string;
}

function MessageSkeleton({ isUser }: { isUser: boolean }) {
    return (
        <div
            className={cn(
                'flex gap-3 p-4',
                isUser ? 'flex-row-reverse' : 'flex-row'
            )}
        >
            {/* Message content skeleton */}
            <div
                className={cn(
                    'flex flex-col gap-2 max-w-[70%]',
                    isUser ? 'items-end' : 'items-start'
                )}
            >
                <div
                    className={cn(
                        'rounded-2xl p-4 space-y-2',
                        isUser
                            ? 'bg-secondary rounded-br-sm'
                            : 'bg-background rounded-bl-sm'
                    )}
                >
                    {/* Text lines skeleton */}
                    <div className="h-4 w-48 bg-muted-foreground/20 rounded animate-pulse" />
                    <div className="h-4 w-64 bg-muted-foreground/20 rounded animate-pulse" />
                    {!isUser && (
                        <div className="h-4 w-40 bg-muted-foreground/20 rounded animate-pulse" />
                    )}
                </div>
            </div>
        </div>
    );
}

export function ChatSkeleton({
    messageCount = 4,
    className,
}: ChatSkeletonProps) {
    // Alternate between user and assistant messages
    const messages = Array.from({ length: messageCount }, (_, i) => ({
        id: i,
        isUser: i % 2 === 0,
    }));

    return (
        <div
            className={cn(
                'flex h-screen w-full sm:max-w-[760px] flex-col bg-background',
                className
            )}
        >

            {/* Messages area */}
            <div className="flex-1 overflow-hidden p-4 space-y-2">
                {messages.map((msg) => (
                    <MessageSkeleton key={msg.id} isUser={msg.isUser} />
                ))}
            </div>

            {/* Input area skeleton */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-12 bg-muted rounded-xl animate-pulse" />
                    <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}
