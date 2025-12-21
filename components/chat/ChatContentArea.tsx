'use client'

import { useCallback, useEffect, useRef } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { useHTMLPreview } from '@/components/providers/html-preview-provider'
import { useSidebar } from '@/components/providers/sidebar-provider'
import { HTMLPreviewPanelContent, HTMLPreviewBottomSheet } from '@/components/chat/html_preview/HTMLPreviewPanel'
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/components/ui/resizable'

// Khi preview panel chiếm > 55% → collapse sidebar để có thêm không gian
const SIDEBAR_COLLAPSE_THRESHOLD = 55

interface ChatContentAreaProps {
    children: React.ReactNode
}

/**
 * ChatContentArea - Quản lý resizable layout cho chat và preview
 * 
 * Features:
 * - Desktop: Resizable split pane (chat | preview)
 * - Mobile: Stack layout với bottom sheet
 * - Auto collapse sidebar: Khi preview panel quá rộng, sidebar sẽ tự đóng
 */
export function ChatContentArea({ children }: ChatContentAreaProps) {
    const { isOpen, closePreview } = useHTMLPreview()
    const { isCollapsed, setCollapsed } = useSidebar()
    const previewPanelRef = useRef<ImperativePanelHandle>(null)
    const wasCollapsedByResize = useRef(false)

    // Xử lý khi resize - auto collapse sidebar nếu preview quá rộng
    const handleLayout = useCallback((sizes: number[]) => {
        if (!isOpen || sizes.length < 2) return
        
        const previewSize = sizes[1]
        
        // Nếu preview > threshold và sidebar đang mở → collapse sidebar
        if (previewSize > SIDEBAR_COLLAPSE_THRESHOLD && !isCollapsed) {
            setCollapsed(true)
            wasCollapsedByResize.current = true
        }
        // Nếu preview <= threshold và đã bị collapse bởi resize → mở lại sidebar
        else if (previewSize <= SIDEBAR_COLLAPSE_THRESHOLD && wasCollapsedByResize.current && isCollapsed) {
            setCollapsed(false)
            wasCollapsedByResize.current = false
        }
    }, [isOpen, isCollapsed, setCollapsed])

    // Reset flag khi preview đóng
    const handlePreviewClose = useCallback(() => {
        if (wasCollapsedByResize.current) {
            setCollapsed(false)
            wasCollapsedByResize.current = false
        }
        closePreview()
    }, [closePreview, setCollapsed])

    return (
        <>
            {/* Desktop: Resizable Panels */}
            <div className="hidden md:flex flex-1 overflow-hidden bg-background" >
                <ResizablePanelGroup 
                    direction="horizontal" 
                    className="h-full"
                    onLayout={handleLayout}
                >
                    {/* Main Content Panel */}
                    <ResizablePanel 
                        defaultSize={isOpen ? 60 : 100} 
                        minSize={25}
                        order={1}
                    >
                        <div className="flex flex-col h-full overflow-hidden">
                            {children}
                        </div>
                    </ResizablePanel>

                    {/* Preview Panel - chỉ hiện khi isOpen */}
                    {isOpen && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel 
                                ref={previewPanelRef}
                                defaultSize={40} 
                                minSize={15}
                                maxSize={75}
                                order={2}
                                collapsible
                                collapsedSize={0}
                                onCollapse={handlePreviewClose}
                            >
                                <HTMLPreviewPanelContent />
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>

            {/* Mobile: Simple flex layout + Bottom Sheet */}
            <div className="md:hidden flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
            <HTMLPreviewBottomSheet />
        </>
    )
}
