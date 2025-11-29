"use client";

import { AdvancedSettings, MCPServerSettings, MemorySettings } from "./content";
import { ThemeSettingsPanel } from "@/components/theme/ThemeSettingsPanel";
import { SettingsTab, SettingsTabConfig } from "./types";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface SettingsContentProps {
  activeTab: SettingsTab;
  tabs: SettingsTabConfig[];
  onBack?: () => void;
  showBackButton?: boolean;
}

const CONTENT_COMPONENTS: Record<SettingsTab, React.ComponentType> = {
  memory: MemorySettings,
  mcp: MCPServerSettings,
  appearance: ThemeSettingsPanel,
  advanced: AdvancedSettings,
};

export const SettingsContent: React.FC<SettingsContentProps> = ({
  activeTab,
  tabs,
  onBack,
  showBackButton = false 
}) => {
  const ContentComponent = CONTENT_COMPONENTS[activeTab];
  const tabConfig = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Nút Back cho mobile */}
      {showBackButton && (
        <div className="md:hidden border-b border-border px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 -ml-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
      )}

      {/* Content chính */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl md:text-2xl">
              {tabConfig?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1">
            <ContentComponent />
          </div>
        </div>
      </div>
    </div>
  );
};