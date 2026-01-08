/**
 * User Avatar Component with Dropdown Menu
 * Displays user avatar with dropdown for settings and logout
 */

'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { LogOut, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/providers/sidebar-provider';

interface UserAvatarProps {
    className?: string;
    showEmail?: boolean;
    size?: 'sm' | 'md' | 'lg';
    onSettingsClick?: () => void;
}

export function UserAvatar({
    className,
    showEmail = true,
    size = 'md',
    onSettingsClick,
}: UserAvatarProps) {
    const { user, logout, loading } = useAuth();
    const { isCollapsed } = useSidebar();

    if (!user) return null;

    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base',
    };

    const initial = user.email?.[0]?.toUpperCase() || 'U';

    const handleLogout = async () => {
        await logout();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={loading}>
                <button
                    className={cn(
                        'flex items-center p-1 w-full',
                        'hover:bg-sidebar-accent transition-colors rounded-lg cursor-pointer',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        isCollapsed ? 'justify-center' : 'gap-3',
                        className
                    )}
                    aria-label="User menu"
                >
                    <div
                        className={cn(
                            'rounded-full flex items-center justify-center font-medium',
                            'bg-primary text-primary-foreground select-none',
                            sizeClasses[size]
                        )}
                    >
                        {initial}
                    </div>
                    {!isCollapsed && showEmail && (
                        <div className="flex-1 overflow-hidden text-left select-none">
                            <p className="text-sm font-medium truncate text-foreground">
                                {user.email || 'User'}
                            </p>
                        </div>
                    )}
                    {!isCollapsed && <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            { 'User display name'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                    disabled={loading}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
