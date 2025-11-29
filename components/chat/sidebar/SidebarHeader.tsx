import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NewChatButton = ({ onClick }: { onClick: () => void }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        onClick={onClick}
        variant="ghost"
        className="hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <p>New chat</p>
    </TooltipContent>
  </Tooltip>
);

export const SidebarHeader = ({
  isCollapsed,
  onNewChat,
  onToggleCollapse,
  onCloseMobile,
}: {
  isCollapsed: boolean;
  onNewChat: () => void;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}) => (
  <div
    className={cn(
      "flex items-center",
      isCollapsed ? "justify-center p-2" : "justify-between p-4"
    )}
  >
    {/* Logo */}
    {!isCollapsed && (
      <Label className="text-sidebar-accent-foreground text-lg mr-4">
        Copilot-Chan
      </Label>
    )}

    {/* New Chat Button (Expanded) */}
    {!isCollapsed && <NewChatButton onClick={onNewChat} />}

    {/* Collapse Toggle (Desktop) */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onToggleCollapse}
          variant="ghost"
          className="hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
      </TooltipContent>
    </Tooltip>
  </div>
);
