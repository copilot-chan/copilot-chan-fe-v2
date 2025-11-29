/**
 * Theme Presets
 * Built-in theme configurations for the application
 */

import { ThemeConfig } from '@/types/theme';

/**
 * Light mode themes
 */
export const LIGHT_THEMES: ThemeConfig[] = [
    {
        id: 'light',
        name: 'Light',
        type: 'light',
        colors: {
            background: 'hsl(0 0% 100%)',
            foreground: 'hsl(240 10% 3.9%)',
            card: 'hsl(0 0% 100%)',
            cardForeground: 'hsl(240 10% 3.9%)',
            popover: 'hsl(0 0% 100%)',
            popoverForeground: 'hsl(240 10% 3.9%)',
            primary: 'hsl(240 5.9% 10%)',
            primaryForeground: 'hsl(0 0% 98%)',
            secondary: 'hsl(240 4.8% 95.9%)',
            secondaryForeground: 'hsl(240 5.9% 10%)',
            muted: 'hsl(240 4.8% 95.9%)',
            mutedForeground: 'hsl(240 3.8% 46.1%)',
            accent: 'hsl(240 4.8% 95.9%)',
            accentForeground: 'hsl(240 5.9% 10%)',
            destructive: 'hsl(0 84.2% 60.2%)',
            destructiveForeground: 'hsl(0 0% 98%)',
            border: 'hsl(240 5.9% 90%)',
            input: 'hsl(240 5.9% 90%)',
            ring: 'hsl(240 10% 3.9%)',
            chart1: 'hsl(12 76% 61%)',
            chart2: 'hsl(173 58% 39%)',
            chart3: 'hsl(197 37% 24%)',
            chart4: 'hsl(43 74% 66%)',
            chart5: 'hsl(27 87% 67%)',
            sidebarBackground: 'hsl(0 0% 98%)',
            sidebarForeground: 'hsl(240 5.3% 26.1%)',
            sidebarPrimary: 'hsl(240 5.9% 10%)',
            sidebarPrimaryForeground: 'hsl(0 0% 98%)',
            sidebarAccent: 'hsl(240 4.8% 95.9%)',
            sidebarAccentForeground: 'hsl(240 5.9% 10%)',
            sidebarBorder: 'hsl(220 13% 91%)',
            sidebarRing: 'hsl(217.2 91.2% 59.8%)',
        },
    },
    {
        id: 'sunset',
        name: 'Sunset',
        type: 'light',
        colors: {
            background: 'hsl(30 50% 98%)',
            foreground: 'hsl(30 40% 15%)',
            card: 'hsl(30 40% 95%)',
            cardForeground: 'hsl(30 40% 15%)',
            popover: 'hsl(30 40% 95%)',
            popoverForeground: 'hsl(30 40% 15%)',
            primary: 'hsla(35, 67%, 88%, 1.00)',
            primaryForeground: 'hsl(0 0% 100%)',
            secondary: 'hsl(35 60% 90%)',
            secondaryForeground: 'hsl(30 40% 15%)',
            muted: 'hsl(35 60% 90%)',
            mutedForeground: 'hsl(30 30% 45%)',
            accent: 'hsl(45 90% 60%)',
            accentForeground: 'hsl(30 40% 15%)',
            destructive: 'hsl(0 84% 60%)',
            destructiveForeground: 'hsl(0 0% 100%)',
            border: 'hsl(30 30% 85%)',
            input: 'hsl(30 30% 85%)',
            ring: 'hsl(15 85% 55%)',
            chart1: 'hsl(15 85% 55%)',
            chart2: 'hsl(30 85% 60%)',
            chart3: 'hsl(45 90% 60%)',
            chart4: 'hsl(10 80% 50%)',
            chart5: 'hsl(35 75% 55%)',
            sidebarBackground: 'hsl(30 40% 95%)',
            sidebarForeground: 'hsl(30 40% 15%)',
            sidebarPrimary: 'hsl(15 85% 55%)',
            sidebarPrimaryForeground: 'hsl(0 0% 100%)',
            sidebarAccent: 'hsl(35 60% 90%)',
            sidebarAccentForeground: 'hsl(30 40% 15%)',
            sidebarBorder: 'hsl(30 30% 85%)',
            sidebarRing: 'hsl(15 85% 55%)',
        },
    },
    {
        id: 'ocean',
        name: 'Ocean',
        type: 'light',
        colors: {
            background: 'hsl(200 50% 98%)',
            foreground: 'hsl(200 40% 15%)',
            card: 'hsl(200 40% 95%)',
            cardForeground: 'hsl(200 40% 15%)',
            popover: 'hsl(200 40% 95%)',
            popoverForeground: 'hsl(200 40% 15%)',
            primary: 'hsl(200 90% 45%)',
            primaryForeground: 'hsl(0 0% 100%)',
            secondary: 'hsl(195 50% 90%)',
            secondaryForeground: 'hsl(200 40% 15%)',
            muted: 'hsl(195 50% 90%)',
            mutedForeground: 'hsl(200 30% 45%)',
            accent: 'hsl(190 80% 50%)',
            accentForeground: 'hsl(0 0% 100%)',
            destructive: 'hsl(0 84% 60%)',
            destructiveForeground: 'hsl(0 0% 100%)',
            border: 'hsl(200 30% 85%)',
            input: 'hsl(200 30% 85%)',
            ring: 'hsl(200 90% 45%)',
            chart1: 'hsl(200 90% 45%)',
            chart2: 'hsl(190 80% 50%)',
            chart3: 'hsl(210 85% 55%)',
            chart4: 'hsl(180 75% 45%)',
            chart5: 'hsl(195 80% 50%)',
            sidebarBackground: 'hsl(200 40% 95%)',
            sidebarForeground: 'hsl(200 40% 15%)',
            sidebarPrimary: 'hsl(200 90% 45%)',
            sidebarPrimaryForeground: 'hsl(0 0% 100%)',
            sidebarAccent: 'hsl(195 50% 90%)',
            sidebarAccentForeground: 'hsl(200 40% 15%)',
            sidebarBorder: 'hsl(200 30% 85%)',
            sidebarRing: 'hsl(200 90% 45%)',
        },
    },
];

/**
 * Dark mode themes
 */
export const DARK_THEMES: ThemeConfig[] = [
    {
        id: 'dark',
        name: 'Dark',
        type: 'dark',
        colors: {
            background: 'hsl(240 10% 3.9%)',
            foreground: 'hsl(0 0% 98%)',
            card: 'hsl(240 10% 3.9%)',
            cardForeground: 'hsl(0 0% 98%)',
            popover: 'hsl(240 10% 3.9%)',
            popoverForeground: 'hsl(0 0% 98%)',
            primary: 'hsl(0 0% 98%)',
            primaryForeground: 'hsl(240 5.9% 10%)',
            secondary: 'hsl(240 3.7% 15.9%)',
            secondaryForeground: 'hsl(0 0% 98%)',
            muted: 'hsl(240 3.7% 15.9%)',
            mutedForeground: 'hsl(240 5% 64.9%)',
            accent: 'hsl(240 3.7% 15.9%)',
            accentForeground: 'hsl(0 0% 98%)',
            destructive: 'hsl(0 62.8% 30.6%)',
            destructiveForeground: 'hsl(0 0% 98%)',
            border: 'hsl(240 3.7% 15.9%)',
            input: 'hsl(240 3.7% 15.9%)',
            ring: 'hsl(240 4.9% 83.9%)',
            chart1: 'hsl(220 70% 50%)',
            chart2: 'hsl(160 60% 45%)',
            chart3: 'hsl(30 80% 55%)',
            chart4: 'hsl(280 65% 60%)',
            chart5: 'hsl(340 75% 55%)',
            sidebarBackground: 'hsl(240 5.9% 10%)',
            sidebarForeground: 'hsl(240 4.8% 95.9%)',
            sidebarPrimary: 'hsl(224.3 76.3% 48%)',
            sidebarPrimaryForeground: 'hsl(0 0% 100%)',
            sidebarAccent: 'hsl(240 3.7% 15.9%)',
            sidebarAccentForeground: 'hsl(240 4.8% 95.9%)',
            sidebarBorder: 'hsl(240 3.7% 15.9%)',
            sidebarRing: 'hsl(217.2 91.2% 59.8%)',
        },
    },
    {
        id: 'midnight',
        name: 'Midnight Blue',
        type: 'dark',
        colors: {
            background: 'hsl(220 30% 5%)',
            foreground: 'hsl(210 40% 98%)',
            card: 'hsl(220 28% 8%)',
            cardForeground: 'hsl(210 40% 98%)',
            popover: 'hsl(220 28% 8%)',
            popoverForeground: 'hsl(210 40% 98%)',
            primary: 'hsl(217 91% 60%)',
            primaryForeground: 'hsl(0 0% 100%)',
            secondary: 'hsl(220 20% 15%)',
            secondaryForeground: 'hsl(210 40% 98%)',
            muted: 'hsl(220 20% 15%)',
            mutedForeground: 'hsl(210 30% 70%)',
            accent: 'hsl(217 91% 60%)',
            accentForeground: 'hsl(0 0% 100%)',
            destructive: 'hsl(0 70% 50%)',
            destructiveForeground: 'hsl(0 0% 100%)',
            border: 'hsl(220 20% 18%)',
            input: 'hsl(220 20% 18%)',
            ring: 'hsl(217 91% 60%)',
            chart1: 'hsl(217 91% 60%)',
            chart2: 'hsl(190 70% 55%)',
            chart3: 'hsl(270 70% 60%)',
            chart4: 'hsl(330 70% 60%)',
            chart5: 'hsl(30 80% 60%)',
            sidebarBackground: 'hsl(220 28% 8%)',
            sidebarForeground: 'hsl(210 40% 98%)',
            sidebarPrimary: 'hsl(217 91% 60%)',
            sidebarPrimaryForeground: 'hsl(0 0% 100%)',
            sidebarAccent: 'hsl(220 20% 15%)',
            sidebarAccentForeground: 'hsl(210 40% 98%)',
            sidebarBorder: 'hsl(220 20% 18%)',
            sidebarRing: 'hsl(217 91% 60%)',
        },
    },
    {
        id: 'forest',
        name: 'Forest',
        type: 'dark',
        colors: {
            background: 'hsl(140 30% 8%)',
            foreground: 'hsl(140 20% 95%)',
            card: 'hsl(140 25% 12%)',
            cardForeground: 'hsl(140 20% 95%)',
            popover: 'hsl(140 25% 12%)',
            popoverForeground: 'hsl(140 20% 95%)',
            primary: 'hsl(145 70% 50%)',
            primaryForeground: 'hsl(0 0% 100%)',
            secondary: 'hsl(140 20% 18%)',
            secondaryForeground: 'hsl(140 20% 95%)',
            muted: 'hsl(140 20% 18%)',
            mutedForeground: 'hsl(140 15% 65%)',
            accent: 'hsl(160 60% 45%)',
            accentForeground: 'hsl(0 0% 100%)',
            destructive: 'hsl(0 70% 50%)',
            destructiveForeground: 'hsl(0 0% 100%)',
            border: 'hsl(140 20% 22%)',
            input: 'hsl(140 20% 22%)',
            ring: 'hsl(145 70% 50%)',
            chart1: 'hsl(145 70% 50%)',
            chart2: 'hsl(160 60% 45%)',
            chart3: 'hsl(120 60% 45%)',
            chart4: 'hsl(85 60% 50%)',
            chart5: 'hsl(175 55% 45%)',
            sidebarBackground: 'hsl(140 25% 12%)',
            sidebarForeground: 'hsl(140 20% 95%)',
            sidebarPrimary: 'hsl(145 70% 50%)',
            sidebarPrimaryForeground: 'hsl(0 0% 100%)',
            sidebarAccent: 'hsl(140 20% 18%)',
            sidebarAccentForeground: 'hsl(140 20% 95%)',
            sidebarBorder: 'hsl(140 20% 22%)',
            sidebarRing: 'hsl(145 70% 50%)',
        },
    },
];

/**
 * All built-in themes combined
 */
export const ALL_THEMES: ThemeConfig[] = [...LIGHT_THEMES, ...DARK_THEMES];

/**
 * Built-in theme presets map (for backward compatibility and O(1) lookup)
 */
export const THEME_PRESETS: Record<string, ThemeConfig> = ALL_THEMES.reduce(
    (acc, theme) => {
        acc[theme.id] = theme;
        return acc;
    },
    {} as Record<string, ThemeConfig>
);

/**
 * Default theme ID to use when no preference is saved
 */
export const DEFAULT_THEME = 'light';

/**
 * Get all available theme IDs
 */
export function getAvailableThemeIds(): string[] {
    return ALL_THEMES.map((t) => t.id);
}

/**
 * Get theme configuration by ID
 */
export function getThemeById(id: string): ThemeConfig | undefined {
    return THEME_PRESETS[id];
}

/**
 * Check if a theme ID is valid
 */
export function isValidThemeId(id: string): boolean {
    return id in THEME_PRESETS;
}
