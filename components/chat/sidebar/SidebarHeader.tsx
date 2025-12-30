import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeftOpen, Plus, X } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/meparator';

export const SidebarHeader = ({
    isCollapsed,
    onNewChat,
    onToggleCollapse,
    onCloseMobile,
    isMobileView = false,
}: {
    isCollapsed: boolean;
    onNewChat: () => void;
    onToggleCollapse: () => void;
    onCloseMobile: () => void;
    isMobileView?: boolean;
}) => {
    if (isMobileView) {
        // Mobile view
        return (
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full p-4">
                    <Link href="/" className="cursor-pointer">
                        <Label className="text-sidebar-accent-foreground text-lg cursor-pointer">
                            Copilot-chan
                        </Label>
                    </Link>
                    <Button
                        onClick={onCloseMobile}
                        variant="ghost"
                        className="hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <Separator />
                <div className="p-2 w-full flex flex-col">
                    <Button
                        onClick={onNewChat}
                        variant="ghost"
                        className="hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors flex items-center"
                    >
                        <Plus className="w-5 h-5 shrink-0 mr-2 stroke-2" />
                        <Label className="flex-1 text-left">New chat</Label>
                    </Button>
                </div>
            </div>
        );
    }

    // Desktop view
    return (
        <div className="flex items-center">
            {!isCollapsed && (
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center w-full p-4">
                        <Link href="/" className="cursor-pointer">
                            <Label className="text-sidebar-accent-foreground text-lg mr-4 cursor-pointer">
                                Copilot-Chan
                            </Label>
                        </Link>
                        <Button
                            onClick={onToggleCollapse}
                            variant="ghost"
                            className="hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                            aria-label="Collapse sidebar"
                        >
                            <PanelLeftClose className="w-5 h-5" />
                        </Button>
                    </div>

                    <Separator />

                    <div className="p-2 w-full flex flex-col">
                        <Button
                            onClick={onNewChat}
                            variant="ghost"
                            className="hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors flex items-center"
                        >
                            <Plus className="w-5 h-5 shrink-0 mr-2 stroke-2" />
                            <Label className="flex-1 text-left">New chat</Label>
                        </Button>
                    </div>
                </div>
            )}

            {isCollapsed && (
                <div className="flex flex-col items-center justify-center w-full p-4 gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={onToggleCollapse}
                                variant="ghost"
                                className="hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                                aria-label="Expand sidebar"
                            >
                                <PanelLeftOpen className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Expand sidebar</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={onNewChat}
                                variant="ghost"
                                className="hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>New chat</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};
