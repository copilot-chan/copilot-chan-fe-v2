/**
 * Theme Switcher Component
 * Provides UI for switching between themes and theme modes
 */

'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Theme Switcher Component
 * Dropdown menu for selecting theme mode and preset
 */
export function ThemeSwitcher() {
    const {
        themeMode,
        setThemeMode,
        currentTheme,
        availableThemes,
        setTheme,
        isDark,
        isMounted,
    } = useTheme();

    // Don't render until mounted to avoid SSR mismatch
    if (!isMounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Monitor className="h-5 w-5" />
            </Button>
        );
    }

    // Icon based on current theme mode
    const ModeIcon = themeMode === 'auto' ? Monitor : isDark ? Moon : Sun;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <ModeIcon className="h-5 w-5 transition-transform hover:rotate-12" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Theme Mode</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => setThemeMode('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                    {themeMode === 'light' && (
                        <span className="ml-auto text-primary">✓</span>
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setThemeMode('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    {themeMode === 'dark' && (
                        <span className="ml-auto text-primary">✓</span>
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setThemeMode('auto')}>
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
                    {themeMode === 'auto' && (
                        <span className="ml-auto text-primary">✓</span>
                    )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Theme Preset</DropdownMenuLabel>

                {availableThemes.map((theme) => (
                    <DropdownMenuItem
                        key={theme.id}
                        onClick={() => setTheme(theme.id)}
                    >
                        <div
                            className="mr-2 h-4 w-4 rounded-full border-2 border-border"
                            style={{ backgroundColor: theme.colors.primary }}
                            aria-hidden="true"
                        />
                        <span>{theme.name}</span>
                        {currentTheme.id === theme.id && (
                            <span className="ml-auto text-primary">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Compact Theme Switcher
 * Simpler version with just mode toggle button
 */
export function CompactThemeSwitcher() {
    const { themeMode, setThemeMode, isDark, isMounted } = useTheme();

    if (!isMounted) {
        return null;
    }

    const handleToggle = () => {
        if (themeMode === 'light') {
            setThemeMode('dark');
        } else if (themeMode === 'dark') {
            setThemeMode('auto');
        } else {
            setThemeMode('light');
        }
    };

    const Icon = themeMode === 'auto' ? Monitor : isDark ? Moon : Sun;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            title={`Current: ${themeMode} mode`}
        >
            <Icon className="h-5 w-5 transition-transform hover:rotate-12" />
            <span className="sr-only">Toggle theme ({themeMode})</span>
        </Button>
    );
}
