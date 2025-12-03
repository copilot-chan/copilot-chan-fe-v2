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

    // Mobile styles
    const mobileSidebarClasses = cn(
        'flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
        'fixed inset-y-0 left-0 z-50 w-64 transform',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
    );

    // Desktop styles
    const desktopSidebarClasses = cn(
        'hidden md:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
        'relative',
        isCollapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded
    );

    return (
        <>
            <MobileMenuButton
                onClick={toggleMobileMenu}
                isOpen={isMobileOpen}
            />
            <MobileOverlay isOpen={isMobileOpen} onClose={handleCloseMobile} />

            {/* Mobile Sidebar */}
            <div className={mobileSidebarClasses}>
                <SidebarHeader
                    isCollapsed={isCollapsed}
                    onNewChat={handleNewChat}
                    onToggleCollapse={toggleCollapse}
                    onCloseMobile={handleCloseMobile}
                    isMobileView={true}
                />
                <Separator />
                <ChatListSection isCollapsed={isCollapsed} />
                <Separator />
                <SidebarFooter />
            </div>

            {/* Desktop Sidebar */}
            <div className={desktopSidebarClasses}>
                <SidebarHeader
                    isCollapsed={isCollapsed}
                    onNewChat={handleNewChat}
                    onToggleCollapse={toggleCollapse}
                    onCloseMobile={handleCloseMobile}
                    isMobileView={false}
                />
                <Separator />
                <ChatListSection isCollapsed={isCollapsed} />
                <Separator />
                <SidebarFooter />
            </div>
        </>
    );
}
