'use client';
import { ThinkingMessage } from '@/components/chat/message/ThinkingMessage';
import {
    CatchAllActionRenderProps,
    useCopilotAction,
} from '@copilotkit/react-core';
import React from 'react';
import MCPToolCall from './UIToolCall';
import { CheckCircle2, Database, Globe, Palette, Search } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { ThemeMode } from '@/types/theme';

export function CopilotActionRender() {
    const { setTheme, setThemeMode, registerTheme } = useTheme();

    // --- search_memory ---
    useCopilotAction({
        name: 'search_memory',
        available: 'frontend',
        render: ({ status, args, result }) => {
            if (status !== 'complete') {
                return (
                    <ThinkingMessage
                        thinkingMessage={`🔍 Đang tìm trong trí nhớ với từ khóa: ${
                            args?.query || '...'
                        }`}
                    />
                );
            }
            return (
                <MCPToolCall
                    status={status}
                    name="search_memory"
                    args={args?.query}
                    result={result}
                />
            );
        },
    });

    // --- save_memory ---
    useCopilotAction({
        name: 'save_memory',
        available: 'frontend',
        render: ({ status, args, result }) => {
            if (status !== 'complete') {
                return (
                    <ThinkingMessage
                        thinkingMessage={`💾 Đang lưu vào bộ nhớ: ${
                            args?.content || 'unknown'
                        }...`}
                    />
                );
            }
            return (
                <MCPToolCall
                    status={status}
                    name="save_memory"
                    args={args?.content}
                    result={result}
                />
            );
        },
    });

    // --- google_search_agent ---
    // useCopilotAction({
    //   name: "google_search_agent",
    //   available: "frontend",
    //   render: ({ status, args, result }) => {
    //     if (status !== "complete") {
    //       return (
    //         <ThinkingMessage
    //           thinkingMessage={`🌐 Đang tìm kiếm Google cho: ${
    //             args.request || "..."
    //           }`}
    //         />
    //       );
    //     }
    //     return (
    //       <MCPToolCall
    //         status={status}
    //         name="google_search_agent"
    //         args={args.request}
    //         result={result}
    //       />
    //     );
    //   },
    // });

    useCopilotAction({
        name: 'change_theme_mode',
        available: 'remote',
        description: 'Change the application theme mode (light/dark/auto)',
        parameters: [
            {
                name: 'mode',
                type: 'string',
                description: "The color mode to switch to ('light', 'dark', or 'auto')",
                required: true,
                enum: ['light', 'dark', 'auto'],
            },
        ],
        handler: async ({ mode }) => {
            setThemeMode(mode as ThemeMode);
            return {
                success: true,
                mode,
            };
        },
        render: ({ status, args, result }) => {
            const mode = args?.mode;
            if (status !== 'complete') {
                return (
                    <ThinkingMessage
                        thinkingMessage={`🌗 Changing theme mode to ${mode}...`}
                    />
                );
            }
            return (
                <MCPToolCall
                    status={status}
                    name="change_theme_mode"
                    args={args}
                    result={result}
                />
            );
        },
    });

    useCopilotAction({
        name: 'change_theme_preset',
        available: 'remote',
        description: 'Apply a specific theme preset by ID',
        parameters: [
            {
                name: 'themeId',
                type: 'string',
                description: "The specific theme ID to apply (e.g., 'sunset', 'midnight', 'forest')",
                required: true,
            },
        ],
        handler: async ({ themeId }) => {
            setTheme(themeId);
            return {
                success: true,
                themeId,
            };
        },
        render: ({ status, args, result }) => {
            const themeId = args?.themeId;
            if (status !== 'complete') {
                return (
                    <ThinkingMessage
                        thinkingMessage={`🎨 Applying theme preset: "${themeId}"...`}
                    />
                );
            }
            return (
                <MCPToolCall
                    status={status}
                    name="change_theme_preset"
                    args={args}
                    result={result}
                />
            );
        },
    });
    
    useCopilotAction({
        name: 'register_custom_theme',
        available: 'remote',
        description: 'Register a new custom theme with specific colors',
        parameters: [
            {
                name: 'id',
                type: 'string',
                description: 'Unique ID for the theme (e.g., "ocean-blue")',
                required: true,
            },
            {
                name: 'name',
                type: 'string',
                description: 'Display name for the theme (e.g., "Ocean Blue")',
                required: true,
            },
            {
                name: 'type',
                type: 'string',
                description: 'Base theme type ("light" or "dark")',
                required: true,
                enum: ['light', 'dark'],
            },
            {
                name: 'colors',
                type: 'object',
                description: 'Color palette for the theme (HSL values with "hsl()" wrapper)',
                required: true,
                attributes: [
                    { name: 'background', type: 'string', required: true },
                    { name: 'foreground', type: 'string', required: true },
                    { name: 'primary', type: 'string', required: true },
                    { name: 'primaryForeground', type: 'string', required: true },
                    { name: 'card', type: 'string', required: true },
                    { name: 'cardForeground', type: 'string', required: true },
                    { name: 'popover', type: 'string', required: true },
                    { name: 'popoverForeground', type: 'string', required: true },
                    { name: 'secondary', type: 'string', required: true },
                    { name: 'secondaryForeground', type: 'string', required: true },
                    { name: 'muted', type: 'string', required: true },
                    { name: 'mutedForeground', type: 'string', required: true },
                    { name: 'accent', type: 'string', required: true },
                    { name: 'accentForeground', type: 'string', required: true },
                    { name: 'destructive', type: 'string', required: true },
                    { name: 'destructiveForeground', type: 'string', required: true },
                    { name: 'border', type: 'string', required: true },
                    { name: 'input', type: 'string', required: true },
                    { name: 'ring', type: 'string', required: true },
                ],
            },
        ],
        handler: async ({ id, name, type, colors }) => {
            // Register the theme
            registerTheme({
                id,
                name,
                type: type as 'light' | 'dark',
                colors,
            });
            setThemeMode(type as ThemeMode);
            // Apply the theme immediately
            setTheme(id);
            
            return {
                success: true,
                message: `Theme "${name}" registered and applied successfully.`,
            };
        },
        render: ({ status, args, result }) => {
            if (status !== 'complete') {
                return (
                    <ThinkingMessage
                        thinkingMessage={`🎨 Creating new theme: ${
                            args?.name || 'Custom Theme'
                        }...`}
                    />
                );
            }

            return (
                <MCPToolCall
                    status={status}
                    name="register_custom_theme"
                    args={args}
                    result={result}
                />
            );
        },
    });

    // useCopilotAction({
    //   name: "sayHello",
    //   description: "Say hello to the user",
    //   available: "remote",
    //   parameters: [
    //     {
    //       name: "name",
    //       type: "string",
    //       description: "The name of the user to say hello to",
    //       required: true,
    //     },
    //   ],
    //   handler: async ({ name }) => {
    //     alert(`Hello, ${name}!`);
    //   },
    // });

    useCopilotAction({
        name: '*',
        render: ({
            name,
            status,
            args,
            result,
        }: CatchAllActionRenderProps<[]>) => (
            <MCPToolCall
                status={status}
                name={name}
                args={args}
                result={result}
            />
        ),
    });

    return null;
}
