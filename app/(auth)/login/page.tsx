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
            <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 text-white">
            <div className="flex flex-col items-center gap-4 p-8 rounded-lg border border-zinc-800 bg-zinc-900">
                <h1 className="text-2xl font-bold">Welcome to Copilot Chan</h1>
                <p className="text-zinc-400">Please sign in to continue</p>
                <button
                    onClick={login}
                    className="px-4 py-2 rounded bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
