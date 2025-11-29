/**
 * Theme Provider
 * Centralized theme management using React Context
 * Handles theme state, persistence, and system preference detection
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { ThemeConfig, ThemeMode } from "@/types/theme";
import {
  THEME_PRESETS,
  DEFAULT_THEME,
  LIGHT_THEMES,
  DARK_THEMES,
} from "@/lib/theme/presets";
import {
  applyTheme,
  getSystemTheme,
  watchSystemTheme,
  getLocalStorage,
  setLocalStorage,
} from "@/lib/theme/utils";

/**
 * Theme context value interface
 */
interface ThemeContextValue {
  /** Current active theme configuration */
  currentTheme: ThemeConfig;

  /** Current theme mode setting */
  themeMode: ThemeMode;

  /** Set theme by ID */
  setTheme: (themeId: string) => void;

  /** Set theme mode */
  setThemeMode: (mode: ThemeMode) => void;

  /** Register a custom theme */
  registerTheme: (theme: ThemeConfig) => void;

  /** Unregister a custom theme */
  unregisterTheme: (themeId: string) => void;

  /** All available themes (built-in + custom) */
  availableThemes: ThemeConfig[];

  /** Whether current resolved theme is dark */
  /** Whether current resolved theme is dark */
  isDark: boolean;

  /** Actual theme applied ('light' or 'dark' after auto resolution) */
  resolvedTheme: "light" | "dark";

  /** Whether the provider is mounted (for SSR compatibility) */
  isMounted: boolean;

  /** Themes available for the current resolved mode */
  themesForCurrentMode: ThemeConfig[];

  /** All light themes (built-in + custom) */
  lightThemes: ThemeConfig[];

  /** All dark themes (built-in + custom) */
  darkThemes: ThemeConfig[];
}

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Storage keys for persistence
 */
const STORAGE_KEY = "copilot-chan-theme";
const MODE_STORAGE_KEY = "copilot-chan-theme-mode";
const CUSTOM_THEMES_STORAGE_KEY = "copilot-chan-custom-themes";

/**
 * Theme Provider Props
 */
interface ThemeProviderProps {
  children: ReactNode;
  /** Default theme ID (optional, defaults to 'light') */
  defaultTheme?: string;
  /** Default theme mode (optional, defaults to 'auto') */
  defaultMode?: ThemeMode;
}

/**
 * Theme Provider Component
 * Wrap your app with this to enable theme management
 */
export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  defaultMode = "auto",
}: ThemeProviderProps) {
  // SSR-safe mounted state
  const [isMounted, setIsMounted] = useState(false);

  // Theme state
  const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultMode);
  const [currentThemeId, setCurrentThemeId] = useState<string>(defaultTheme);
  const [customThemes, setCustomThemes] = useState<ThemeConfig[]>([]);

  // Initialize from localStorage on mount
  useEffect(() => {
    setIsMounted(true);

    // Load saved preferences
    const savedMode = getLocalStorage(MODE_STORAGE_KEY) as ThemeMode;
    const savedThemeId = getLocalStorage(STORAGE_KEY);
    const savedCustomThemes = getLocalStorage(CUSTOM_THEMES_STORAGE_KEY);

    if (savedMode && ["light", "dark", "auto"].includes(savedMode)) {
      setThemeModeState(savedMode);
    }

    if (savedThemeId) {
      setCurrentThemeId(savedThemeId);
    }

    if (savedCustomThemes) {
      try {
        const parsed = JSON.parse(savedCustomThemes);
        if (Array.isArray(parsed)) {
          setCustomThemes(parsed);
        }
      } catch (e) {
        console.error("Failed to parse custom themes", e);
      }
    }
  }, []);

  // Compute available themes (built-in + custom)
  const availableThemes = [...Object.values(THEME_PRESETS), ...customThemes];

  // Split themes by type
  const lightThemes = [
    ...LIGHT_THEMES,
    ...customThemes.filter((t) => t.type === "light"),
  ];
  const darkThemes = [
    ...DARK_THEMES,
    ...customThemes.filter((t) => t.type === "dark"),
  ];

  // Get current theme config
  const currentTheme =
    availableThemes.find((t) => t.id === currentThemeId) ||
    THEME_PRESETS[defaultTheme] ||
    THEME_PRESETS[DEFAULT_THEME];

  // Resolve actual theme based on mode
  const resolvedTheme: "light" | "dark" =
    themeMode === "auto"
      ? getSystemTheme()
      : themeMode === "dark"
      ? "dark"
      : "light";

  const isDark = resolvedTheme === "dark";

  // Get themes for current mode
  const themesForCurrentMode = isDark ? darkThemes : lightThemes;

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    if (!isMounted) return;

    applyTheme(currentTheme, resolvedTheme);
  }, [isMounted, currentTheme, resolvedTheme]);

  // Watch for system theme changes when in auto mode
  useEffect(() => {
    if (!isMounted || themeMode !== "auto") return;

    const cleanup = watchSystemTheme((systemTheme) => {
      // Theme will auto-update via resolvedTheme dependency
      // This triggers a re-render which updates resolvedTheme
      // Force update by using a state setter
      setThemeModeState("auto"); // This triggers re-render
    });

    return cleanup;
  }, [isMounted, themeMode]);

  // Auto-switch theme when resolved mode changes (e.g. system theme change in auto mode)
  useEffect(() => {
    if (!isMounted) return;

    const currentThemeConfig = availableThemes.find(
      (t) => t.id === currentThemeId
    );

    // If current theme is incompatible with the new resolved mode, switch to a default
    if (currentThemeConfig && currentThemeConfig.type !== resolvedTheme) {
      const newThemeList =
        resolvedTheme === "dark" ? DARK_THEMES : LIGHT_THEMES;

      // Try to find a theme with the same name if possible, otherwise first
      // For now just pick the first one to ensure consistency
      const fallback = newThemeList[0];

      if (fallback) {
        setCurrentThemeId(fallback.id);
        // We don't save this to localStorage because the user didn't explicitly choose it
        // This allows them to switch back to the other mode and potentially restore their previous choice
        // if we implemented history, but for now this is safe.
        // Actually, if we don't save it, on refresh it might be wrong?
        // If mode is 'auto', we don't save themeId usually? No, we do.
        // If I save it, then I lose the "Midnight Blue" preference when I switch to Light and back.
        // But for now, correctness is more important than history.
        setLocalStorage(STORAGE_KEY, fallback.id);
      }
    }
  }, [resolvedTheme, isMounted, availableThemes, currentThemeId]);

  // Theme setter with persistence
  const setTheme = useCallback(
    (themeId: string) => {
      const themeExists = availableThemes.some((t) => t.id === themeId);
      if (!themeExists) {
        console.warn(
          `Theme "${themeId}" not found. Available themes:`,
          availableThemes.map((t) => t.id)
        );
        return;
      }

      setCurrentThemeId(themeId);
      setLocalStorage(STORAGE_KEY, themeId);
    },
    [availableThemes]
  );

  // Theme mode setter with persistence and auto-switching
  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      if (!["light", "dark", "auto"].includes(mode)) {
        console.warn(`Invalid theme mode: ${mode}`);
        return;
      }

      setThemeModeState(mode);
      setLocalStorage(MODE_STORAGE_KEY, mode);

      // Determine target resolved theme
      const targetResolved =
        mode === "auto" ? getSystemTheme() : mode === "dark" ? "dark" : "light";

      // Check if current theme matches the new mode
      const currentThemeConfig = availableThemes.find(
        (t) => t.id === currentThemeId
      );

      // If current theme is incompatible with new mode, switch to a default for that mode
      if (currentThemeConfig && currentThemeConfig.type !== targetResolved) {
        const newThemeList =
          targetResolved === "dark" ? DARK_THEMES : LIGHT_THEMES;
        // Try to find a theme with the same name if possible (unlikely but nice), otherwise first
        const fallback = newThemeList[0];
        if (fallback) {
          setCurrentThemeId(fallback.id);
          setLocalStorage(STORAGE_KEY, fallback.id);
        }
      }
    },
    [availableThemes, currentThemeId]
  );

  // Register custom theme
  const registerTheme = useCallback((theme: ThemeConfig) => {
    if (!theme.id || !theme.name || !theme.colors) {
      console.warn("Invalid theme configuration:", theme);
      return;
    }

    setCustomThemes((prev) => {
      // Check if theme already exists
      const existingIndex = prev.findIndex((t) => t.id === theme.id);

      if (existingIndex >= 0) {
        // Update existing theme
        const updated = [...prev];
        updated[existingIndex] = theme;
        setLocalStorage(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }

      // Add new theme
      const updated = [...prev, theme];
      setLocalStorage(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Unregister custom theme
  const unregisterTheme = useCallback(
    (themeId: string) => {
      // Prevent unregistering built-in themes
      if (themeId in THEME_PRESETS) {
        console.warn(`Cannot unregister built-in theme: ${themeId}`);
        return;
      }

      setCustomThemes((prev) => {
        const updated = prev.filter((t) => t.id !== themeId);
        setLocalStorage(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      // If current theme is being removed, switch to default
      if (currentThemeId === themeId) {
        setTheme(defaultTheme);
      }
    },
    [currentThemeId, defaultTheme, setTheme]
  );

  // Provide context value
  const value: ThemeContextValue = {
    currentTheme,
    themeMode,
    setTheme,
    setThemeMode,
    registerTheme,
    unregisterTheme,
    availableThemes,
    isDark,
    resolvedTheme,
    isMounted,
    themesForCurrentMode,
    lightThemes,
    darkThemes,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * Access theme context in any component
 *
 * @throws Error if used outside ThemeProvider
 * @returns Theme context value
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

/**
 * useThemeColors Hook
 * Convenience hook to access just the theme colors
 *
 * @returns Current theme colors
 */
export function useThemeColors() {
  const { currentTheme } = useTheme();
  return currentTheme.colors;
}

/**
 * useIsDark Hook
 * Convenience hook to check if current theme is dark
 *
 * @returns Whether current theme is dark
 */
export function useIsDark(): boolean {
  const { isDark } = useTheme();
  return isDark;
}
