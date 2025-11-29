'use client';

import { Settings } from 'lucide-react';
import { useSettings } from './settings-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/providers/sidebar-provider';
import { Label } from '@/components/ui/label';

export function SettingsToggle({ className }: { className?: string }) {
    const { setOpen } = useSettings();
    const { isCollapsed } = useSidebar();

    return (
        <Button
            onClick={() => setOpen(true)}
            variant={'ghost'}
            className="hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
        >
            <Settings className="w-5 h-5" />
            {!isCollapsed && <Label> Settings</Label>}
        </Button>
    );
}
