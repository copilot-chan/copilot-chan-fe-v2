/**
 * Settings Menu Component
 * Navigation menu for settings tabs using the new Menu component
 */

"use client";

import { Menu, MenuItem, MenuLabel } from "@/components/ui/Menu";
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
    <div className="w-full md:w-[200px] lg:w-[240px] flex flex-col gap-2">
      <MenuLabel>Settings</MenuLabel>
      <Menu>
        {tabs.map((tab) => (
          <MenuItem
            key={tab.id}
            active={activeTab === tab.id}
            icon={tab.icon}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
