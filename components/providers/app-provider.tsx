'use client';

import { CopilotKit } from '@copilotkit/react-core';
import { AuthProvider, useAuth } from '@/components/providers/auth-provider';
import {
    ChatSessionProvider,
    useChatSession,
} from '@/components/providers/chat-session-provider';
import '@copilotkit/react-ui/styles.css';
import { SidebarProvider } from './sidebar-provider';
import { SettingsProvier } from '../chat/settings/settings-provider';
import { ThemeProvider } from './theme-provider';
import { OptimisticChatProvider } from './optimistic-chat-provider';
import { TooltipProvider } from '../ui/tooltip';
import { HTMLPreviewProvider } from './html-preview-provider';

function CopilotKitWrapper({ children }: { children: React.ReactNode }) {
    const { token, user } = useAuth();
    const { sessionId } = useChatSession();

    return (
        <CopilotKit
            key={sessionId} // Force remount to clear state when switching sessions
            runtimeUrl="/api/copilotkit"
            properties={token ? { authorization: `Bearer ${token}` } : {}}
            headers={user?.id ? { 'x-user-id': user.id } : {}}
            agent="chat_agent"
            showDevConsole={
                process.env.NODE_ENV === 'development' ||
                process.env.IS_DEV === 'true'
            }
            publicLicenseKey={
                process.env.NEXT_PUBLIC_COPILOKIT_LICENSE_KEY ||
                'NEXT_PUBLIC_COPILOKIT_LICENSE_KEY'
            }
            threadId={sessionId}
        >
            {children}
        </CopilotKit>
    );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ChatSessionProvider>
                    <OptimisticChatProvider>
                        <SidebarProvider>
                            <SettingsProvier>
                                <TooltipProvider delayDuration={300}>
                                    <HTMLPreviewProvider>
                                        <CopilotKitWrapper>
                                            {children}
                                        </CopilotKitWrapper>
                                    </HTMLPreviewProvider>
                                </TooltipProvider>
                            </SettingsProvier>
                        </SidebarProvider>
                    </OptimisticChatProvider>
                </ChatSessionProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
