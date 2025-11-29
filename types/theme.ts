/**
 * Theme Management System - Type Definitions
 * Production-ready TypeScript types for theme configuration
 */

// Theme modes supported by the application
export type ThemeMode = 'light' | 'dark' | 'auto';

// Custom theme identifier
export type CustomTheme = string;

/**
 * Comprehensive theme configuration interface
 * Defines all customizable aspects of a theme
 */
export interface ThemeConfig {
  /** Unique identifier for the theme */
  id: string;
  
  /** Display name for UI */
  name: string;
  
  /** Base theme type */
  type: 'light' | 'dark';
  
  /** Color palette configuration */
  colors: ThemeColors;
  
  /** Optional font configuration */
  fonts?: ThemeFonts;
  
  /** Optional spacing configuration */
  spacing?: ThemeSpacing;
  
  /** Optional border radius configuration */
  borderRadius?: ThemeBorderRadius;
}

/**
 * Complete color system for a theme
 * All colors use HSL format: hsl(h s% l%)
 */
export interface ThemeColors {
  // Base colors
  background: string;
  foreground: string;
  
  // Component colors
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  
  // Semantic colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  
  // UI elements
  border: string;
  input: string;
  ring: string;
  
  // Chart colors (optional)
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  
  // Sidebar specific colors
  sidebarBackground?: string;
  sidebarForeground?: string;
  sidebarPrimary?: string;
  sidebarPrimaryForeground?: string;
  sidebarAccent?: string;
  sidebarAccentForeground?: string;
  sidebarBorder?: string;
  sidebarRing?: string;
}

/**
 * Font configuration for a theme
 */
export interface ThemeFonts {
  /** Sans-serif font family */
  sans: string;
  
  /** Monospace font family */
  mono: string;
}

/**
 * Spacing configuration for a theme
 */
export interface ThemeSpacing {
  /** Base spacing unit in pixels */
  unit: number;
}

/**
 * Border radius configuration for a theme
 */
export interface ThemeBorderRadius {
  /** Small border radius */
  sm: string;
  
  /** Medium border radius */
  md: string;
  
  /** Large border radius */
  lg: string;
  
  /** Full/circle border radius */
  full: string;
}

/**
 * Theme preference stored in localStorage
 */
export interface ThemePreference {
  /** Selected theme mode */
  mode: ThemeMode;
  
  /** Currently active theme ID */
  themeId: string;
  
  /** Timestamp of last update */
  updatedAt?: number;
}

/**
 * Theme change event data
 */
export interface ThemeChangeEvent {
  /** Previous theme configuration */
  previous: ThemeConfig;
  
  /** New theme configuration */
  current: ThemeConfig;
  
  /** Theme mode */
  mode: ThemeMode;
  
  /** Resolved theme type (after auto resolution) */
  resolved: 'light' | 'dark';
}

/**
 * HSL color components
 */
export interface HSLColor {
  /** Hue (0-360) */
  h: number;
  
  /** Saturation (0-100) */
  s: number;
  
  /** Lightness (0-100) */
  l: number;
  
  /** Optional alpha (0-1) */
  a?: number;
}
