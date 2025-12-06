'use client'

import { createContext, ReactNode, useContext, useState } from "react"

interface HTMLPreviewContextType {
  isOpen: boolean
  code: string | null
  openPreview: (code: string) => void
  closePreview: () => void
}

const HTMLPreviewContext = createContext<HTMLPreviewContextType | undefined>(undefined)

export function HTMLPreviewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [code, setCode] = useState<string | null>(null)

  const openPreview = (newCode: string) => {
    setCode(newCode)
    setIsOpen(true)
  }

  const closePreview = () => {
    setIsOpen(false)
  }

  return (
    <HTMLPreviewContext.Provider
      value={{
        isOpen,
        code,
        openPreview,
        closePreview,
      }}
    >
      {children}
    </HTMLPreviewContext.Provider>
  )
}

export function useHTMLPreview() {
  const ctx = useContext(HTMLPreviewContext)
  if (!ctx) {
    throw new Error("useHTMLPreview must be used within HTMLPreviewProvider")
  }
  return ctx
}