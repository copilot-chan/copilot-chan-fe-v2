'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ChatSidebar } from '@/components/chat/sidebar/ChatSidebar';
import { Settings } from '@/components/chat/settings';
import { ChatContentArea } from '@/components/chat/ChatContentArea';

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

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
                Loading...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen bg-zinc-950 text-white">
            <ChatSidebar />
            <Settings />
            <ChatContentArea>{children}</ChatContentArea>
        </div>
    );
}
