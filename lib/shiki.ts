'use client'
import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki/bundle/web'

// Singleton pattern - chỉ init 1 lần
let highlighterPromise: Promise<Highlighter> | null = null

/**
 * Lấy highlighter instance (singleton)
 * Instance chỉ được tạo 1 lần và được cache
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      // Chỉ dùng themes có trong bundle/web
      // Xem danh sách đầy đủ: https://shiki.matsu.io/themes
      themes: [
        'github-dark',
        'github-light',
        'vitesse-dark',
        'vitesse-light',
        'material-theme-darker',
        'material-theme-lighter',
      ],
      langs: [
        'javascript',
        'typescript',
        'tsx',
        'jsx',
        'python',
        'html',
        'css',
        'json',
        'bash',
        'shell',
        'markdown',
        'yaml',
        'sql',
      ],
    })
  }
  return highlighterPromise
}

/**
 * Highlight code với Shiki
 * @param code - Code cần highlight
 * @param lang - Ngôn ngữ (nếu không support sẽ fallback về plaintext)
 * @param isDark - Dark mode flag (true = dark theme, false = light theme)
 * @returns HTML string đã được highlight
 */
export async function highlightCode(
  code: string,
  lang: string,
  isDark: boolean = true
): Promise<string> {
  try {
    const highlighter = await getHighlighter()
    
    // Auto-select theme based on isDark
    const theme = isDark ? 'material-theme-darker' : 'material-theme-lighter'
    
    // Kiểm tra language có được support không
    const loadedLangs = highlighter.getLoadedLanguages()
    const safeLang = loadedLangs.includes(lang as BundledLanguage) 
      ? (lang as BundledLanguage)
      : 'plaintext'
    
    return highlighter.codeToHtml(code, {
      lang: safeLang,
      theme,
    })
  } catch (error) {
    // Fallback nếu có lỗi
    console.error('Shiki highlight error:', error)
    return `<pre><code>${escapeHtml(code)}</code></pre>`
  }
}

/**
 * Escape HTML để tránh XSS khi fallback
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
