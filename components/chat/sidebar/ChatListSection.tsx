import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ChatList } from './ChatList';
import { cn } from '@/lib/utils';

export const ChatListSection = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
        <Suspense
            fallback={
                <div className="flex justify-center p-4">
                    <LoadingSpinner text={isCollapsed ? '' : 'Loading...'} />
                </div>
            }
        >
            <div className={cn(isCollapsed && 'hidden')}>
                <ChatList />
            </div>
        </Suspense>
    </div>
);
