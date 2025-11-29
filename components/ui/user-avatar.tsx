/**
 * User Avatar Component
 * Displays user avatar with theme support
 */

'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    className?: string;
    showEmail?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({
    className,
    showEmail = true,
    size = 'md',
}: UserAvatarProps) {
    const { user } = useAuth();

    if (!user) return null;

    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base',
    };

    const initial = user.email?.[0]?.toUpperCase() || 'U';

    return (
        <div className={cn('flex items-center gap-3 p-4', className)}>
            <div
                className={cn(
                    'rounded-full flex items-center justify-center font-medium',
                    'bg-primary text-primary-foreground',
                    sizeClasses[size]
                )}
            >
                {initial}
            </div>
            {showEmail && (
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate text-foreground">
                        {user.email || 'User'}
                    </p>
                </div>
            )}
        </div>
    );
}
