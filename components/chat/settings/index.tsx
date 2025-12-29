"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SettingsMenu } from "./settings-menu";
import { SettingsContent } from "./settings-content";
import { useSettings } from "./settings-provider";
import { SETTINGS_TABS, SettingsTab } from "./types";
import { useEffect, useState } from "react";

const SIDEBAR_WIDTH = " sm:max-w-full";
const DIALOG_WIDTH =
  "w-full max-w-full sm:max-w-full md:max-w-2xl lg:max-w-5xl xl:max-w-6xl";
const DIALOG_HIGHT = "h-[80vh] overflow-y-auto";

export function Settings() {
  const { open, setOpen, activeTab, setActiveTab } = useSettings();
  const [showContent, setShowContent] = useState(false);

  // Reset về menu khi đóng dialog
  useEffect(() => {
    if (!open) {
      setShowContent(false);
    }
  }, [open]);

  const handleTabChange = (tabId: SettingsTab) => {
    setActiveTab(tabId);
    setShowContent(true);
  };

  const handleBack = () => {
    setShowContent(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        side="settings"
        className={`${DIALOG_WIDTH} ${DIALOG_HIGHT} right-0 flex flex-col md:flex-row overflow-hidden gap-0 font-sans`}
        aria-label="Settings"
      >
        <aside
          className={`${SIDEBAR_WIDTH} bg-sidebar flex-shrink-0 overflow-y-auto ${
            showContent ? "hidden" : "flex"
          } md:flex flex-col`}
          role="complementary"
          aria-label="Settings navigation"
        >
          <SettingsMenu
            tabs={SETTINGS_TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </aside>

        {/* Content Area - Ẩn trên mobile khi đang xem menu */}
        <div
          className={`flex-1 ${
            showContent ? "flex" : "hidden md:flex"
          } flex-col overflow-hidden`}
        >
          
          <SettingsContent
            activeTab={activeTab}
            tabs={SETTINGS_TABS}
            onBack={handleBack}
            showBackButton={showContent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
