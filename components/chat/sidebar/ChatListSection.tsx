import { Suspense } from 'react';
import { ChatListSkeleton } from '../skeleton/ChatListSkeleton';
import { ChatList } from './ChatList';
import { cn } from '@/lib/utils';

export const ChatListSection = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
        <Suspense
            fallback={<ChatListSkeleton isCollapsed={isCollapsed} />}
        >
            <div className={cn(isCollapsed && 'hidden')}>
                <ChatList />
            </div>
        </Suspense>
    </div>
);
