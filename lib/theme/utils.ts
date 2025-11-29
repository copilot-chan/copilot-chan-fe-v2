/**
 * Theme Utilities
 * Core functions for theme management and application
 */

import { ThemeConfig } from '@/types/theme';

/**
 * Apply theme to DOM by setting CSS variables
 * This function updates all CSS custom properties to match the theme
 *
 * @param theme - Theme configuration to apply
 * @param mode - Resolved theme mode ('light' or 'dark')
 */
export function applyTheme(theme: ThemeConfig, mode: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Remove existing theme classes
  root.classList.remove('light', 'dark');
  root.classList.add(mode);

  // Apply color CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = `--${camelToKebab(key)}`;
    root.style.setProperty(cssVarName, value);
  });

  // Apply fonts if specified
  if (theme.fonts) {
    root.style.setProperty('--font-sans', theme.fonts.sans);
    root.style.setProperty('--font-mono', theme.fonts.mono);
  }

  // Apply border radius if specified
  if (theme.borderRadius) {
    root.style.setProperty('--radius', theme.borderRadius.md);
    root.style.setProperty('--radius-sm', theme.borderRadius.sm);
    root.style.setProperty('--radius-lg', theme.borderRadius.lg);
  }

  // Apply spacing if specified
  if (theme.spacing) {
    root.style.setProperty('--spacing-unit', `${theme.spacing.unit}px`);
  }
}

/**
 * Get system color scheme preference
 * Checks the user's OS/browser dark mode setting
 *
 * @returns 'light' or 'dark' based on system preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Listen to system theme changes
 * Calls the callback whenever the user's system theme preference changes
 *
 * @param callback - Function to call when system theme changes
 * @returns Cleanup function to remove the listener
 */
export function watchSystemTheme(
  callback: (theme: 'light' | 'dark') => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }

  // Fallback for older browsers
  // @ts-ignore - deprecated API but needed for older browsers
  mediaQuery.addListener(handler);
  // @ts-ignore
  return () => mediaQuery.removeListener(handler);
}

/**
 * Convert camelCase to kebab-case
 * Used for converting JavaScript property names to CSS variable names
 *
 * @param str - camelCase string
 * @returns kebab-case string
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 * Used for converting CSS variable names to JavaScript property names
 *
 * @param str - kebab-case string
 * @returns camelCase string
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Get CSS variable value from the document root
 *
 * @param varName - CSS variable name (with or without --)
 * @returns CSS variable value
 */
export function getCSSVariable(varName: string): string {
  if (typeof document === 'undefined') return '';

  const name = varName.startsWith('--') ? varName : `--${varName}`;
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/**
 * Set CSS variable on the document root
 *
 * @param varName - CSS variable name (with or without --)
 * @param value - Value to set
 */
export function setCSSVariable(varName: string, value: string): void {
  if (typeof document === 'undefined') return;

  const name = varName.startsWith('--') ? varName : `--${varName}`;
  document.documentElement.style.setProperty(name, value);
}

/**
 * Export current theme as JSON
 * Useful for theme sharing or debugging
 *
 * @param theme - Theme configuration to export
 * @returns JSON string of the theme
 */
export function exportThemeAsJSON(theme: ThemeConfig): string {
  return JSON.stringify(theme, null, 2);
}

/**
 * Import theme from JSON string
 * Validates and parses a theme from JSON
 *
 * @param json - JSON string of theme configuration
 * @returns Parsed theme configuration or null if invalid
 */
export function importThemeFromJSON(json: string): ThemeConfig | null {
  try {
    const theme = JSON.parse(json) as ThemeConfig;

    // Basic validation
    if (!theme.id || !theme.name || !theme.type || !theme.colors) {
      return null;
    }

    return theme;
  } catch {
    return null;
  }
}

/**
 * Debounce function for performance optimization
 * Useful for limiting theme change frequency
 *
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if code is running on the server
 *
 * @returns true if running on server, false if on client
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Check if code is running on the client
 *
 * @returns true if running on client, false if on server
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Safely access localStorage
 * Returns null on server or if localStorage is not available
 *
 * @param key - Storage key
 * @returns Stored value or null
 */
export function getLocalStorage(key: string): string | null {
  if (isServer()) return null;

  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely write to localStorage
 * Does nothing on server or if localStorage is not available
 *
 * @param key - Storage key
 * @param value - Value to store
 */
export function setLocalStorage(key: string, value: string): void {
  if (isServer()) return;

  try {
    localStorage.setItem(key, value);
  } catch {
    // Fail silently if localStorage is not available
  }
}

/**
 * Safely remove from localStorage
 *
 * @param key - Storage key
 */
export function removeLocalStorage(key: string): void {
  if (isServer()) return;

  try {
    localStorage.removeItem(key);
  } catch {
    // Fail silently
  }
}
