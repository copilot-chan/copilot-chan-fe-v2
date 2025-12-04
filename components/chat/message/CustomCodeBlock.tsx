'use client'
import React, { useState, useEffect } from 'react'
import { Check, Copy, Play } from 'lucide-react'
import { highlightCode } from '@/lib/shiki'
import { useTheme } from '@/components/providers/theme-provider'

interface CustomCodeBlockProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * Custom Code Block Component với Shiki syntax highlighting
 * Dùng cho inline code và block code trong markdown
 */
export function CustomCodeBlock({
  inline,
  className,
  children,
  ...props
}: CustomCodeBlockProps) {
  // Inline code - render đơn giản
  if (inline || !className?.includes('language-')) {
    return <strong>{children}</strong>
  }

  // Extract language từ className (format: language-xxx)
  const match = /language-([a-zA-Z0-9#+-]+)/.exec(className)
  const language = match?.[1] || 'plaintext'

  return (
    <CodeBlockWithHighlight
      code={String(children).replace(/\n$/, '')}
      language={language}
    />
  )
}

/**
 * Code Block với Shiki highlighting
 * Tách riêng để xử lý async highlighting và theme switching
 */
interface CodeBlockWithHighlightProps {
  code: string
  language: string
}

function CodeBlockWithHighlight({ code, language }: CodeBlockWithHighlightProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Get theme from app context
  const { isDark } = useTheme()

  useEffect(() => {
    let isMounted = true

    async function highlight() {
      // Pass isDark flag để auto-select theme
      const html = await highlightCode(code, language, isDark)
      
      if (isMounted) {
        setHighlightedHtml(html)
        setIsLoading(false)
      }
    }

    highlight()

    // Cleanup để tránh memory leak
    return () => {
      isMounted = false
    }
  }, [code, language, isDark]) // Re-highlight khi theme thay đổi


  return (
    <div className="relative my-4 rounded-lg border bg-muted/50 overflow-hidden group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/80">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {language}
        </span>
        <div className="flex items-center gap-2">
          <PreviewButton code={code} />
          <CopyButton code={code} />
        </div>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-x-auto">
        {isLoading ? (
          <div className="text-muted-foreground text-sm animate-pulse">
            Loading...
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        )}
      </div>
    </div>
  )
}

/**
 * Copy Button Component
 * Copy code to clipboard với feedback animation
 */
function CopyButton({ code }: { code: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
      title="Copy code"
      aria-label="Copy code to clipboard"
    >
      {isCopied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  )
}

/**
 * Preview Button Component
 * Placeholder cho preview feature
 */
function PreviewButton({ code }: { code: string }) {
  const handlePreview = () => {
    console.log('Previewing code:', code)
    alert('Preview feature coming soon!\n\nCode:\n' + code.substring(0, 100) + '...')
  }

  return (
    <button
      onClick={handlePreview}
      className="p-1.5 rounded-md hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
      title="Preview"
      aria-label="Preview code"
    >
      <Play className="w-3.5 h-3.5" />
    </button>
  )
}
