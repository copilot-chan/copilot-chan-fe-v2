import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThinkingMessageProps {
  thinkingMessage: string;
  className?: string;
}

export function ThinkingMessage({
  thinkingMessage,
  className,
}: ThinkingMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 text-sm text-muted-foreground bg-muted/30 rounded-lg border border-transparent animate-in fade-in slide-in-from-bottom-2 duration-300",
        className
      )}
    >
      <Loader2 className="w-4 h-4 animate-spin text-primary" />
      <span className="italic">{thinkingMessage}</span>
    </div>
  );
}
