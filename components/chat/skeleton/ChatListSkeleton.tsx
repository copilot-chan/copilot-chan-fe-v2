'use client';

import { cn } from '@/lib/utils';

interface ChatListSkeletonProps {
    itemCount?: number;
    isCollapsed?: boolean;
    className?: string;
}

function ChatItemSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
    if (isCollapsed) {
        return (
            <div className="flex justify-center p-2">
                <div className="h-8 w-8 rounded-md bg-muted-foreground/50 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 p-2 rounded-md">
   
            <div className="flex-1 h-4 bg-muted-foreground/50 rounded animate-pulse shrink-0" />
        </div>
    );
}

export function ChatListSkeleton({
    itemCount = 6,
    isCollapsed = false,
    className,
}: ChatListSkeletonProps) {
    const items = Array.from({ length: itemCount }, (_, i) => i);

    return (
        <div className={cn('space-y-1', className)}>
            {items.map((i) => (
                <ChatItemSkeleton key={i} isCollapsed={isCollapsed} />
            ))}
        </div>
    );
}
