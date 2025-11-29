import { useChatSession } from '@/components/providers/chat-session-provider';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/components/providers/sidebar-provider';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/meparator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { MobileMenuButton, MobileOverlay } from './MobileNav';
import { SidebarHeader } from './SidebarHeader';
import { ChatListSection } from './ChatListSection';
import { SidebarFooter } from './SidebarFooter';

// Constants
const MOBILE_BREAKPOINT = 768;
const SIDEBAR_WIDTH = {
    expanded: 'md:w-64',
    collapsed: 'md:w-16',
};

// Main ChatSidebar Component
export function ChatSidebar() {
    const { generateNewSession } = useChatSession();
    const router = useRouter();
    const {
        isCollapsed,
        isMobileOpen,
        toggleCollapse,
        toggleMobileMenu,
        setMobileMenu,
    } = useSidebar();

    const handleNewChat = () => {
        generateNewSession();
        router.push('/');

        if (window.innerWidth < MOBILE_BREAKPOINT) {
            setMobileMenu(false);
        }
    };

    const handleCloseMobile = () => setMobileMenu(false);

    const sidebarClasses = cn(
        // Base styles
        'flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
        // Mobile styles
        'fixed inset-y-0 left-0 z-50 w-64 transform',
        !isMobileOpen && '-translate-x-full md:translate-x-0',
        // Desktop styles
        'md:relative md:transform-none',
        isCollapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded
    );

    return (
        <>
            <MobileMenuButton
                onClick={toggleMobileMenu}
                isOpen={isMobileOpen}
            />
            <MobileOverlay isOpen={isMobileOpen} onClose={handleCloseMobile} />

            <div className={sidebarClasses}>
                <SidebarHeader
                    isCollapsed={isCollapsed}
                    onNewChat={handleNewChat}
                    onToggleCollapse={toggleCollapse}
                    onCloseMobile={handleCloseMobile}
                />

                {isCollapsed && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={handleNewChat}
                                variant="ghost"
                                className="hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                                aria-label="New chat"
                            >
                                <Plus className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>New chat</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                <Separator />
                <ChatListSection isCollapsed={isCollapsed} />

                <Separator />
                <SidebarFooter />
            </div>
        </>
    );
}
