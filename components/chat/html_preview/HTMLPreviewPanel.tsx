'use client'

import { useEffect, useState } from 'react'
import { X, ExternalLink, RefreshCw } from 'lucide-react'
import { useHTMLPreview } from '@/components/providers/html-preview-provider'

/**
 * HTML Preview Panel Content
 * Nội dung bên trong panel, được render bởi layout
 */
export function HTMLPreviewPanelContent() {
  const { code, closePreview } = useHTMLPreview()
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  // Tạo Blob URL từ HTML code
  useEffect(() => {
    if (!code) {
      setBlobUrl(null)
      return
    }

    const fullHtml = code.trim().toLowerCase().startsWith('<!doctype') 
      ? code 
      : `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      padding: 16px;
      margin: 0;
    }
  </style>
</head>
<body>
${code}
</body>
</html>`

    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    setBlobUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [code])

  const handleRefresh = () => {
    setKey(prev => prev + 1)
  }

  const handleOpenInNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank')
    }
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg text-card-foreground ">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30 flex-shrink-0 rounded-lg shadow-md mb-2">
        <span className="text-sm font-medium">HTML Preview</span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={closePreview}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white overflow-hidden">
        {blobUrl ? (
          <iframe
            key={key}
            src={blobUrl}
            sandbox="allow-scripts"
            className="w-full h-full border-0"
            title="HTML Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No HTML to preview
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Mobile Bottom Sheet Version
 */
export function HTMLPreviewBottomSheet() {
  const { isOpen, code, closePreview } = useHTMLPreview()
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!code) {
      setBlobUrl(null)
      return
    }

    const fullHtml = code.trim().toLowerCase().startsWith('<!doctype') 
      ? code 
      : `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      padding: 16px;
      margin: 0;
    }
  </style>
</head>
<body>
${code}
</body>
</html>`

    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    setBlobUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [code])

  const handleRefresh = () => setKey(prev => prev + 1)
  const handleOpenInNewTab = () => blobUrl && window.open(blobUrl, '_blank')

  if (!isOpen) return null

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[50vh] bg-background border-t z-40 flex flex-col animate-in slide-in-from-bottom duration-200">
      {/* Drag indicator */}
      <div className="flex justify-center py-2">
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 flex-shrink-0">
        <span className="text-sm font-medium">HTML Preview</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={closePreview}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white overflow-hidden">
        {blobUrl ? (
          <iframe
            key={key}
            src={blobUrl}
            sandbox="allow-scripts"
            className="w-full h-full border-0"
            title="HTML Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No HTML to preview
          </div>
        )}
      </div>
    </div>
  )
}
