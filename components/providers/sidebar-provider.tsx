"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  toggleMobileMenu: () => void;
  setMobileMenu: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (storedCollapsed) {
      setIsCollapsed(JSON.parse(storedCollapsed));
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const setMobileMenu = (open: boolean) => {
    setIsMobileOpen(open);
  };

  // Prevent hydration mismatch by not rendering until mounted, 
  // or accept that initial render might differ. 
  // For sidebar state, it's often better to default to expanded and then collapse if needed,
  // or use a layout effect if possible (but that warns in SSR).
  // We'll just return children, but state might update after mount.

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleCollapse,
        toggleMobileMenu,
        setMobileMenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
