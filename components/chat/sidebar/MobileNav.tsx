import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MobileMenuButton = ({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        onClick={onClick}
        variant="ghost"
        className={cn(
          "md:hidden fixed top-4 left-4 z-40 p-2 rounded-md",
          "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80",
          "transition-opacity",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        aria-label="Toggle mobile menu"
      >
        <Menu className="w-5 h-5" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="right">
      <p>Open menu</p>
    </TooltipContent>
  </Tooltip>
);

export const MobileOverlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    />
  );
};
