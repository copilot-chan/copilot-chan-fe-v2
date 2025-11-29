/**
 * Color Utilities for Theme Management
 * Provides functions for color manipulation and conversion
 */

import { HSLColor } from '@/types/theme';

/**
 * Parse HSL color string to components
 * Supports formats: hsl(h s% l%) or hsl(h s% l% / a)
 * 
 * @param hsl - HSL color string
 * @returns Parsed HSL components or null if invalid
 */
export function parseHSL(hsl: string): HSLColor | null {
  // Match format: hsl(h s% l%)
  const match3 = hsl.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (match3) {
    return {
      h: parseInt(match3[1], 10),
      s: parseInt(match3[2], 10),
      l: parseInt(match3[3], 10),
    };
  }
  
  // Match format with alpha: hsl(h s% l% / a)
  const match4 = hsl.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\s*\/\s*([\d.]+)\)/);
  if (match4) {
    return {
      h: parseInt(match4[1], 10),
      s: parseInt(match4[2], 10),
      l: parseInt(match4[3], 10),
      a: parseFloat(match4[4]),
    };
  }
  
  return null;
}

/**
 * Convert HSL components to string
 * 
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @param a - Optional alpha (0-1)
 * @returns HSL color string
 */
export function hslToString(h: number, s: number, l: number, a?: number): string {
  if (a !== undefined) {
    return `hsl(${h} ${s}% ${l}% / ${a})`;
  }
  return `hsl(${h} ${s}% ${l}%)`;
}

/**
 * Convert HSLColor object to string
 * 
 * @param color - HSL color object
 * @returns HSL color string
 */
export function hslColorToString(color: HSLColor): string {
  return hslToString(color.h, color.s, color.l, color.a);
}

/**
 * Adjust lightness of an HSL color
 * 
 * @param hsl - HSL color string
 * @param amount - Amount to adjust (-100 to 100)
 * @returns Adjusted HSL color string
 */
export function adjustLightness(hsl: string, amount: number): string {
  const parsed = parseHSL(hsl);
  if (!parsed) return hsl;
  
  const newL = Math.max(0, Math.min(100, parsed.l + amount));
  return hslToString(parsed.h, parsed.s, newL, parsed.a);
}

/**
 * Adjust saturation of an HSL color
 * 
 * @param hsl - HSL color string
 * @param amount - Amount to adjust (-100 to 100)
 * @returns Adjusted HSL color string
 */
export function adjustSaturation(hsl: string, amount: number): string {
  const parsed = parseHSL(hsl);
  if (!parsed) return hsl;
  
  const newS = Math.max(0, Math.min(100, parsed.s + amount));
  return hslToString(parsed.h, newS, parsed.l, parsed.a);
}

/**
 * Adjust hue of an HSL color
 * 
 * @param hsl - HSL color string
 * @param amount - Amount to adjust (degrees, wraps around 360)
 * @returns Adjusted HSL color string
 */
export function adjustHue(hsl: string, amount: number): string {
  const parsed = parseHSL(hsl);
  if (!parsed) return hsl;
  
  const newH = (parsed.h + amount + 360) % 360;
  return hslToString(newH, parsed.s, parsed.l, parsed.a);
}

/**
 * Set alpha channel of an HSL color
 * 
 * @param hsl - HSL color string
 * @param alpha - Alpha value (0-1)
 * @returns HSL color string with alpha
 */
export function setAlpha(hsl: string, alpha: number): string {
  const parsed = parseHSL(hsl);
  if (!parsed) return hsl;
  
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  return hslToString(parsed.h, parsed.s, parsed.l, clampedAlpha);
}

/**
 * Get contrasting color for text on a given background
 * Uses simple lightness threshold
 * 
 * @param background - Background HSL color string
 * @returns Contrasting foreground color (dark or light)
 */
export function getContrastColor(background: string): string {
  const parsed = parseHSL(background);
  if (!parsed) return 'hsl(0 0% 0%)';
  
  // If background is light (lightness > 50), return dark text
  // Otherwise return light text
  return parsed.l > 50 
    ? 'hsl(240 10% 3.9%)' // dark
    : 'hsl(0 0% 98%)';     // light
}

/**
 * Calculate relative luminance of an HSL color
 * Used for WCAG contrast ratio calculations
 * 
 * @param hsl - HSL color string
 * @returns Relative luminance (0-1)
 */
export function getRelativeLuminance(hsl: string): number {
  const parsed = parseHSL(hsl);
  if (!parsed) return 0;
  
  // Convert HSL to RGB first
  const rgb = hslToRgb(parsed.h, parsed.s, parsed.l);
  
  // Calculate relative luminance using WCAG formula
  const [r, g, b] = rgb.map(val => {
    const channel = val / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * 
 * @param color1 - First HSL color string
 * @param color2 - Second HSL color string
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standard
 * 
 * @param foreground - Foreground color
 * @param background - Background color
 * @param level - 'AA' or 'AAA'
 * @param isLargeText - Whether text is large (18pt+)
 * @returns Whether contrast meets standard
 */
export function meetsContrastStandard(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Convert HSL to RGB
 * Helper function for luminance calculations
 * 
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns RGB values [r, g, b] (0-255)
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;
  
  if (sNorm === 0) {
    const gray = Math.round(lNorm * 255);
    return [gray, gray, gray];
  }
  
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const q = lNorm < 0.5 
    ? lNorm * (1 + sNorm) 
    : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;
  
  const r = Math.round(hue2rgb(p, q, hNorm + 1/3) * 255);
  const g = Math.round(hue2rgb(p, q, hNorm) * 255);
  const b = Math.round(hue2rgb(p, q, hNorm - 1/3) * 255);
  
  return [r, g, b];
}
