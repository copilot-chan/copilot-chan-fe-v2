import type React from "react"
import { Database, Server, Cog, Palette } from "lucide-react"

export type SettingsTab = "memory" | "mcp" | "advanced" | "appearance"

export interface SettingsTabConfig {
  id: SettingsTab
  label: string
  icon: React.ComponentType<{ className?: string }>
  title: string
}

export const SETTINGS_TABS: SettingsTabConfig[] = [
  {
    id: "memory",
    label: "Memory",
    icon: Database,
    title: "Memory Settings",
  },
  {
    id: "mcp",
    label: "MCP Server",
    icon: Server,
    title: "MCP Server Settings",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    title: "Appearance Settings",
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: Cog,
    title: "Advanced Settings",
  },
]
