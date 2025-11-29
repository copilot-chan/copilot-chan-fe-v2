"use client"

import { createContext, useContext, useState } from "react";
import { SettingsTab } from "./types";

interface SettingsContextProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export function SettingsProvier({children}:{children:React.ReactNode}){
    const [open,setOpen]=useState(false)
    const [activeTab, setActiveTab] = useState<SettingsTab>("memory");

      return (
    <SettingsContext.Provider value={{ open, setOpen, activeTab, setActiveTab }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}