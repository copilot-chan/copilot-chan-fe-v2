/**
 * Settings Menu Component
 * Navigation menu for settings tabs using the new Menu component
 */

"use client";

import { Menu, MenuItem, MenuLabel } from "@/components/ui/menu";
import { SettingsTab, SettingsTabConfig } from "./types";

interface SettingsMenuProps {
  tabs: SettingsTabConfig[];
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full md:w-[200px] lg:w-[240px] flex flex-col gap-2 p-4 h-full  border-r-2">
      <MenuLabel className="text-lg font-bold px-4 py-4">Settings</MenuLabel>
      <Menu>
        {tabs.map((tab) => (
          <MenuItem
            key={tab.id}
            active={activeTab === tab.id}
            icon={tab.icon}
            onClick={() => onTabChange(tab.id)}
            className="text-base font-medium py-3 px-4"
          >
            {tab.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
