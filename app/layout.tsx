import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/app-provider';
import { ThemeScript } from '@/components/theme/ThemeScript';
import { OptimisticChatProvider } from '@/components/providers/optimistic-chat-provider'; // Added this line
import { Toaster } from 'sonner';

export const metadata: Metadata = {
    title: 'Copilot Chan',
    description: 'AI Chatbot powered by CopilotKit',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeScript />
            </head>
            <body>
                <Toaster position="top-center" />
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
