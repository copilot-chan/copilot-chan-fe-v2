/**
 * Loading Spinner Component
 * Simple loading indicator with theme support
 */

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ 
  text = "Loading...", 
  className,
  size = "md" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={cn(
      "flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground",
      className
    )}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span>{text}</span>}
    </div>
  );
}
