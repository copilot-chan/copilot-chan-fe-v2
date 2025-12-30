'use client';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/meparator';

interface SidebarSkeletonProps {
    isCollapsed?: boolean;
    chatItemCount?: number;
    className?: string;
}

function ChatItemSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
    if (isCollapsed) {
        return (
            <div className="flex justify-center p-2">
                <div className="h-8 w-8 rounded-md bg-sidebar-accent/50 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 p-2 mx-2 rounded-md">
            <div className="h-4 w-4 rounded bg-sidebar-accent/50 animate-pulse shrink-0" />
            <div className="flex-1 h-4 bg-sidebar-accent/50 rounded animate-pulse" />
        </div>
    );
}

function HeaderSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
    if (isCollapsed) {
        return (
            <div className="flex flex-col items-center justify-center w-full p-4 gap-2">
                <div className="h-8 w-8 rounded-md bg-sidebar-accent/50 animate-pulse" />
                <div className="h-8 w-8 rounded-md bg-sidebar-accent/50 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between items-center w-full p-4">
                <div className="h-6 w-28 bg-sidebar-accent/50 rounded animate-pulse" />
                <div className="h-8 w-8 rounded-md bg-sidebar-accent/50 animate-pulse" />
            </div>
            <Separator />
            <div className="p-2 w-full">
                <div className="flex items-center gap-2 p-2">
                    <div className="h-5 w-5 rounded bg-sidebar-accent/50 animate-pulse" />
                    <div className="h-4 w-20 bg-sidebar-accent/50 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}

function FooterSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
    if (isCollapsed) {
        return (
            <div className="flex flex-col items-center gap-2 p-2">
                <div className="h-8 w-8 rounded-md bg-sidebar-accent/50 animate-pulse" />
                <div className="h-8 w-8 rounded-full bg-sidebar-accent/50 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 p-2">
            <div className="flex items-center gap-2 p-2">
                <div className="h-5 w-5 rounded bg-sidebar-accent/50 animate-pulse" />
                <div className="h-4 w-16 bg-sidebar-accent/50 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2 p-2">
                <div className="h-8 w-8 rounded-full bg-sidebar-accent/50 animate-pulse" />
                <div className="h-4 w-24 bg-sidebar-accent/50 rounded animate-pulse" />
            </div>
        </div>
    );
}

export function SidebarSkeleton({
    isCollapsed = false,
    chatItemCount = 6,
    className,
}: SidebarSkeletonProps) {
    const chatItems = Array.from({ length: chatItemCount }, (_, i) => i);

    return (
        <div
            className={cn(
                'flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out h-full',
                isCollapsed ? 'w-16' : 'w-64',
                className
            )}
        >
            {/* Header skeleton */}
            <HeaderSkeleton isCollapsed={isCollapsed} />
            
            <Separator />
            
            {/* Chat list skeleton */}
            <div className="flex-1 overflow-hidden py-2">
                <div className="space-y-1">
                    {chatItems.map((i) => (
                        <ChatItemSkeleton key={i} isCollapsed={isCollapsed} />
                    ))}
                </div>
            </div>
            
            <Separator />
            
            {/* Footer skeleton */}
            <FooterSkeleton isCollapsed={isCollapsed} />
        </div>
    );
}
