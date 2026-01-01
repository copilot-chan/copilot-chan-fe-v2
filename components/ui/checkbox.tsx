"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

// NOTE: This is a simplified version without Radix UI Primitive to avoid installing dependencies
// It uses standard input[type=checkbox] hidden, and a styled div.

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <label className="flex items-center space-x-2 cursor-pointer">
      <input 
        type="checkbox" 
        className="peer sr-only" 
        ref={ref} 
        {...props} 
      />
      <div className={cn(
        "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground flex items-center justify-center",
        className
      )}>
        <Check className="h-3 w-3 opacity-0 peer-checked:opacity-100" />
      </div>
  </label>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
