'use client';

import Link from 'next/link';
import { Chat } from '@/types/api';
import { usePathname } from 'next/navigation';
import { useOptimisticChat } from '@/components/providers/optimistic-chat-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteChatDialog } from './DeleteChatDialog';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatItemProps {
    chat: Chat;
    onDelete?: (id: string) => Promise<void>;
}

export function ChatItem({ chat, onDelete }: ChatItemProps) {
    const pathname = usePathname();
    const { isOptimistic } = useOptimisticChat();
    const isActive = pathname === `/chat/${chat.id}`;
    const isOptimisticItem = isOptimistic(chat.id);

    // Determine display title: use state.title, or appName + id
    const displayTitle =
        chat.state?.title || 'New Chat' || `Chat ${chat.id.slice(0, 4)}`;

    // Show skeleton for optimistic items
    if (isOptimisticItem) {
        return (
            <div className="px-3 py-2 rounded bg-sidebar-accent/50 animate-pulse">
                <Skeleton className="h-4 w-3/4 bg-sidebar-accent-foreground/20" />
            </div>
        );
    }

    return (
        <div className="group relative flex items-center">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={`/chat/${chat.id}`}
                        className={`flex-1 block px-3 py-2 rounded text-sm transition-colors truncate ${
                            isActive
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                    >
                        {displayTitle}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{displayTitle}</p>
                </TooltipContent>
            </Tooltip>

            {onDelete && (
                <DeleteChatDialog chatId={chat.id} onDelete={onDelete} />
            )}
        </div>
    );
}
