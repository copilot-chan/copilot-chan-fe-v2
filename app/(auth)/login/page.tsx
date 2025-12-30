'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function LoginPage() {
    const { user, login, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && !loading) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-foreground">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
            <div className="flex flex-col items-center gap-4 p-8 rounded-lg border border-zinc-800 bg-background">
                <h1 className="text-2xl font-bold">Welcome to Copilot Chan</h1>
                <p className="text-foreground">Please sign in to continue</p>
                <button
                    onClick={login}
                    className="px-4 py-2 rounded bg-primary text-background font-medium hover:bg-primary/80 transition-colors"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
