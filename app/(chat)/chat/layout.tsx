'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ChatSidebar } from '@/components/chat/sidebar/ChatSidebar';
import { Settings } from '@/components/chat/settings';
import { ChatContentArea } from '@/components/chat/ChatContentArea';
import { useApiWarmup } from '@/hooks/use-api-warmup';

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    useApiWarmup();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-secondary text-secondary-foreground">
                Loading...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen bg-secondary text-secondary-foreground">
            <ChatSidebar />
            <Settings />
            <ChatContentArea>{children}</ChatContentArea>
        </div>
    );
}
