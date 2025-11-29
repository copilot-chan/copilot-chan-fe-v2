/**
 * Theme Script Component
 * Prevents flash of unstyled content (FOUC) on page load
 * This script runs before React hydration to apply the saved theme immediately
 */
"use client";

export function ThemeScript() {
  // Inline script that runs immediately on page load
  const themeScript = `
    (function() {
      // Storage keys (must match ThemeProvider)
      const STORAGE_KEY = 'copilot-chan-theme';
      const MODE_STORAGE_KEY = 'copilot-chan-theme-mode';
      
      // Get system theme preference
      function getSystemTheme() {
        if (typeof window === 'undefined') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      try {
        // Load saved preferences from localStorage
        const savedMode = localStorage.getItem(MODE_STORAGE_KEY) || 'auto';
        const savedThemeId = localStorage.getItem(STORAGE_KEY);
        
        // Resolve theme mode (auto -> system preference)
        const resolvedTheme = savedMode === 'auto' 
          ? getSystemTheme() 
          : savedMode === 'dark' 
            ? 'dark' 
            : 'light';
        
        // Apply theme class immediately
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolvedTheme);
        
        // Optional: Set data attribute for debugging
        document.documentElement.setAttribute('data-theme-mode', savedMode);
        document.documentElement.setAttribute('data-theme-resolved', resolvedTheme);
        if (savedThemeId) {
          document.documentElement.setAttribute('data-theme-id', savedThemeId);
        }
      } catch (error) {
        // Fallback to light theme if there's any error
        document.documentElement.classList.add('light');
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
