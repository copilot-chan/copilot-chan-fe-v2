/**
 * Theme Settings Panel Component
 * Advanced theme configuration UI for settings pages
 */

'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { ThemeMode } from '@/types/theme';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/meparator';
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Theme Settings Panel
 * Comprehensive theme configuration interface
 */
export function ThemeSettingsPanel() {
    const {
        currentTheme,
        themesForCurrentMode,
        setTheme,
        themeMode,
        setThemeMode,
        isMounted,
    } = useTheme();

    if (!isMounted) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-20 bg-muted rounded-lg" />
                <div className="h-40 bg-muted rounded-lg" />
            </div>
        );
    }

    const modes: Array<{
        id: ThemeMode;
        icon: typeof Sun;
        label: string;
        description: string;
    }> = [
        {
            id: 'light',
            icon: Sun,
            label: 'Light',
            description: 'Always use light theme',
        },
        {
            id: 'dark',
            icon: Moon,
            label: 'Dark',
            description: 'Always use dark theme',
        },
        {
            id: 'auto',
            icon: Monitor,
            label: 'Auto',
            description: 'Follow system preference',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme Preferences
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Customize the appearance of the application
                </p>
            </div>

            <Separator />

            {/* Mode Selection */}
            <div className="space-y-3">
                <Label className="text-base">Color Mode</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {modes.map((mode) => {
                        const Icon = mode.icon;
                        const isActive = themeMode === mode.id;

                        return (
                            <button
                                key={mode.id}
                                onClick={() => setThemeMode(mode.id)}
                                className={cn(
                                    'relative p-4 rounded-lg border-2 text-left transition-all',
                                    'hover:border-primary/50 hover:shadow-sm',
                                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                    isActive
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-border'
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={cn(
                                            'p-2 rounded-md',
                                            isActive
                                                ? 'bg-primary/10'
                                                : 'bg-muted'
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'h-4 w-4',
                                                isActive
                                                    ? 'text-primary'
                                                    : 'text-muted-foreground'
                                            )}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {mode.label}
                                            </span>
                                            {isActive && (
                                                <Check className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {mode.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <Separator />

            {/* Theme Presets */}
            <div className="space-y-3">
                <Label className="text-base">Theme Presets</Label>
                <p className="text-sm text-muted-foreground">
                    Choose from our collection of beautiful themes
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {themesForCurrentMode.map((theme) => {
                        const isActive = currentTheme.id === theme.id;

                        return (
                            <button
                                key={theme.id}
                                onClick={() => {
                                    if (theme.type !== themeMode) {
                                        setThemeMode(theme.type);
                                    }
                                    setTheme(theme.id);
                                }}
                                className={cn(
                                    'relative p-4 rounded-lg border-2 text-left transition-all',
                                    'hover:border-primary/50 hover:shadow-sm',
                                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                    isActive
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-border'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Color Preview */}
                                    <div className="flex gap-1">
                                        <div
                                            className="h-10 w-3 rounded-sm border border-border"
                                            style={{
                                                backgroundColor:
                                                    theme.colors.primary,
                                            }}
                                            aria-hidden="true"
                                        />
                                        <div
                                            className="h-10 w-3 rounded-sm border border-border"
                                            style={{
                                                backgroundColor:
                                                    theme.colors.accent,
                                            }}
                                            aria-hidden="true"
                                        />
                                        <div
                                            className="h-10 w-3 rounded-sm border border-border"
                                            style={{
                                                backgroundColor:
                                                    theme.colors.secondary,
                                            }}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    {/* Theme Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {theme.name}
                                            </span>
                                            {isActive && (
                                                <Check className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {theme.type} theme
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Info Box */}
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
                <p className="text-muted-foreground">
                    <strong className="text-foreground">Tip:</strong> Your theme
                    preference is automatically saved and will be applied across
                    all your sessions.
                </p>
            </div>
        </div>
    );
}
