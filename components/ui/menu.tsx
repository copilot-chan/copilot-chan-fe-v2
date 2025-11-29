/**
 * Menu Component
 * A versatile menu component for navigation and settings with theme support
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Menu Item Interface
 */
export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
}

/**
 * Menu Props
 */
export interface MenuProps {
  items: MenuItem[];
  orientation?: "horizontal" | "vertical";
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  onItemClick?: (item: MenuItem) => void;
}

/**
 * Menu Root Component
 */
const Menu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
);
Menu.displayName = "Menu";

/**
 * Menu Item Component
 */
interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const MenuItemComponent = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, active, icon: Icon, badge, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        active && "bg-secondary text-secondary-foreground",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="flex-1 text-left">{children}</span>
      {badge !== undefined && (
        <span className={cn(
          "ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs",
          active 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          {badge}
        </span>
      )}
    </button>
  )
);
MenuItemComponent.displayName = "MenuItem";

/**
 * Menu Label Component
 */
const MenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-3 py-2 text-sm font-semibold text-muted-foreground", className)}
      {...props}
    />
  )
);
MenuLabel.displayName = "MenuLabel";

/**
 * Menu Separator Component
 */
const MenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  )
);
MenuSeparator.displayName = "MenuSeparator";

/**
 * Menu Group Component
 */
const MenuGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
);
MenuGroup.displayName = "MenuGroup";

/**
 * Horizontal Menu Variant
 */
const HorizontalMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-1 border-b border-border", className)}
      {...props}
    />
  )
);
HorizontalMenu.displayName = "HorizontalMenu";

/**
 * Horizontal Menu Item
 */
const HorizontalMenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, active, icon: Icon, badge, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        active 
          ? "border-primary text-foreground" 
          : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
      {badge !== undefined && (
        <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
          {badge}
        </span>
      )}
    </button>
  )
);
HorizontalMenuItem.displayName = "HorizontalMenuItem";

export {
  Menu,
  MenuItemComponent as MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuGroup,
  HorizontalMenu,
  HorizontalMenuItem,
};