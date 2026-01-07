'use client';

import useSWR, { mutate } from 'swr';
import { useAuth } from '@/components/providers/auth-provider';
import { ChatItem } from './ChatItem';
import { Chat } from '@/types/api';
import { fetcher } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useChatSession } from '@/components/providers/chat-session-provider';
import { useRouter } from 'next/navigation';

export function ChatList() {
    const { user, token } = useAuth();
    const router = useRouter();
    const { generateNewSession } = useChatSession();

    const { data: sessions } = useSWR<Chat[]>(
        user && token ? [`/api/chats?userId=${user.id}`, token] : null,
        fetcher,
        {
            fallbackData: [],
            revalidateOnFocus: false,
        }
    );

    const handleDelete = async (id: string): Promise<void> => {
        // Optimistic update: remove item immediately
        mutate(
            [`/api/chats?userId=${user?.id}`, token],
            (currentData: Chat[] | undefined) =>
                currentData?.filter((chat) => chat.id !== id),
            false
        );

        const res = await fetch(`/api/chats/${id}?userId=${user?.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            // Revert optimistic update
            mutate([`/api/chats?userId=${user?.id}`, token]);
            throw new Error('Failed to delete chat');
        }

        // Revalidate to ensure sync
        mutate([`/api/chats?userId=${user?.id}`, token]);

        // If we deleted the current chat, redirect to new chat
        if (window.location.pathname === `/chat/${id}`) {
            generateNewSession();
            router.push('/');
        }
    };

    if (!sessions || sessions.length === 0) {
        return (
            <div className="p-4 text-muted-foreground text-sm text-center">
                No chats yet
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {sessions.map((session) => (
                <ChatItem
                    key={session.id}
                    chat={session}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
}
