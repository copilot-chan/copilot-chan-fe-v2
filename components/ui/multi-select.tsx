"use client"

import * as React from "react"
import { X, Check, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  onCreate?: (value: string) => void
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  onCreate,
}: MultiSelectProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleCreate = () => {
      if (onCreate && searchTerm) {
          onCreate(searchTerm);
          setSearchTerm("");
      }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between h-auto min-h-[10px] py-2 px-3"
        >
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 && (
                <span className="text-muted-foreground font-normal">{placeholder}</span>
            )}
            {selected.map((value) => {
                const option = options.find((o) => o.value === value);
                return (
                    <Badge key={value} variant="secondary" className="mr-1">
                        {option ? option.label : value}
                        <div
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSelect(value);
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSelect(value);
                            }}
                        >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </div>
                    </Badge>
                )
            })}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] p-0" align="start">
          <div className="p-2 border-b">
            <Input 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (filteredOptions.length === 0 && onCreate) {
                            handleCreate();
                        }
                    }
                }}
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filteredOptions.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                    No options found.
                    {onCreate && searchTerm && (
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 w-full text-xs"
                            onClick={handleCreate}
                        >
                            Create "{searchTerm}"
                        </Button>
                    )}
                </div>
            )}
            {filteredOptions.map((option) => (
                <div 
                    key={option.value}
                    className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                        selected.includes(option.value) ? "bg-accent" : ""
                    )}
                    onClick={() => handleSelect(option.value)}
                >
                    <div className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selected.includes(option.value) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                    )}>
                        <Check className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.label}</span>
                </div>
            ))}
          </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
