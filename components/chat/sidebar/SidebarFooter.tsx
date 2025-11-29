import { SettingsToggle } from "../settings/settings-toggle";
import { UserAvatar } from "@/components/ui/UserAvatar";

export const SidebarFooter = () => (
  <div className="flex flex-col p-2">
    <SettingsToggle />
    <UserAvatar />
  </div>
);
