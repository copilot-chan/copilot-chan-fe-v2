import { useChatSession } from '@/components/providers/chat-session-provider';
import { usePathname } from 'next/navigation';
import { mutate } from 'swr';
import useSWR from 'swr';
import { useAuth } from '@/components/providers/auth-provider';
import { fetcher } from '@/lib/api';
import { Chat, Message } from '@/types/api';
import { parseMessages } from '@/lib/partParsers';
import {
    Message as CopilotMessage,
    Role,
    TextMessage,
} from '@copilotkit/runtime-client-gql';
import { useMemo, useEffect, useRef } from 'react';
import { useCoAgent } from '@copilotkit/react-core';
import { useOptimisticChat } from '@/components/providers/optimistic-chat-provider';

export function useChatLogic() {
    const { sessionId } = useChatSession();
    const pathname = usePathname();
    const { user, token } = useAuth();
    const { addOptimisticSession } = useOptimisticChat();
    const optimisticAddedRef = useRef<Set<string>>(new Set());

    // Listen to agent state for title updates
    const { state } = useCoAgent<{ title?: string }>({
        name: 'chat_agent',
    });

    // Fetch chat history if sessionId exists and we have a user token
    const { data: chatData, isLoading } = useSWR<Chat>(
        sessionId && user && token
            ? [`/api/chats/${sessionId}?userId=${user.uid}`, token]
            : null,
        fetcher,
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false, // Prevent refetch when browser regains focus
            onError: (err) => {
                if (err.statusCode !== 404) {
                    console.error('Error fetching chat history:', err);
                }
            },
        }
    );

    // Fetch all chats for sidebar
    const { data: allChats } = useSWR<Chat[]>(
        user && token ? [`/api/chats?userId=${user.uid}`, token] : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    const handleMessageSent = async (message: string) => {
        // Only run optimistic update when creating NEW chat from home page
        if (pathname === '/' && sessionId && user && token) {
            // Navigate immediately
            window.history.pushState(null, '', `/chat/${sessionId}`);

            // Check if we already added optimistic for this session
            if (optimisticAddedRef.current.has(sessionId)) {
                return;
            }

            // Check if chat exists in SWR cache
            const chatExists = allChats?.some((chat) => chat.id === sessionId);

            // Only add optimistic if chat doesn't exist yet
            if (!chatExists) {
                // Mark as added
                optimisticAddedRef.current.add(sessionId);

                // Mark as optimistic
                addOptimisticSession(sessionId);

                // Create optimistic chat object
                const optimisticChat: Chat = {
                    id: sessionId,
                    appName: 'copilot-assistant',
                    userId: user.uid,
                    events: [],
                    state: {
                        title:
                            message.slice(0, 50) +
                            (message.length > 50 ? '...' : ''),
                    },
                    createTime: Date.now(),
                    updateTime: Date.now(),
                };

                // Optimistic update
                mutate(
                    [`/api/chats?userId=${user.uid}`, token],
                    (currentData: Chat[] | undefined) => {
                        const existing = currentData || [];
                        return [optimisticChat, ...existing];
                    },
                    false
                );
            }

            // Revalidate after 2s
            setTimeout(() => {
                mutate([`/api/chats?userId=${user.uid}`, token]);
            }, 2000);
        }
    };

    useEffect(() => {
        if (state?.title && user && token) {
            // Debounce or check if needed, but for now just refresh the list
            // to reflect the new title in the sidebar
            mutate([`/api/chats?userId=${user.uid}`, token]);
        }
    }, [state?.title, user, token]);

    // Transform backend messages to Copilot messages
    const initialMessages = useMemo(() => {
        if (!chatData?.events) return [];

        return parseMessages(chatData.events);
    }, [chatData]);

    return {
        isLoading,
        handleMessageSent,
        initialMessages,
        sessionId,
    };
}
