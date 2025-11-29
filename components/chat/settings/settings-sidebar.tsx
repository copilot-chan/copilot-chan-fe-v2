"use client";

import { cn } from "@/lib/utils";
import { SettingsTab, SettingsTabConfig } from "./types";
import { Button } from "@/components/ui/button";

interface SettingsSidebarProps {
  tabs: SettingsTabConfig[];
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsSidebar({
  tabs,
  activeTab,
  onTabChange,
}: SettingsSidebarProps) {
  return (
    <div className="w-full md:w-[200px] lg:w-[240px] flex flex-col gap-1 border-r pr-0 md:pr-4">
      <div className="pb-4">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
          Settings
        </h2>
      </div>
      <nav className="flex flex-col gap-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2 px-2",
              activeTab === tab.id && "bg-secondary"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </nav>
    </div>
  );
}
