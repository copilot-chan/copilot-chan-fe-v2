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
    const { setTheme, setThemeMode } = useTheme();

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
        name: 'change_theme',
        available: 'remote',
        description:
            'Change the application theme or color mode (light/dark/auto)',
        parameters: [
            {
                name: 'mode',
                type: 'string',
                description:
                    "The color mode to switch to ('light', 'dark', or 'auto')",
                required: false,
                enum: ['light', 'dark', 'auto'],
            },
            {
                name: 'themeId',
                type: 'string',
                description:
                    "The specific theme ID to apply (e.g., 'sunset', 'midnight', 'forest')",
                required: false,
            },
        ],
        handler: async ({ mode, themeId }) => {
            if (mode) {
                setThemeMode(mode as ThemeMode);
            }

            if (themeId) {
                setTheme(themeId);
            }

            return {
                success: true,
                mode,
                themeId,
            };
        },
        render: ({ status, args, result }) => {
            const mode = args?.mode;
            const themeId = args?.themeId;

            if (status !== 'complete') {
                return (
                    <ThinkingMessage
                        thinkingMessage={`🎨 Changing theme to ${
                            themeId ? `"${themeId}"` : ''
                        }${mode && themeId ? ' and ' : ''}${
                            mode ? `${mode} mode` : ''
                        }...`}
                    />
                );
            }

            return (
                <MCPToolCall
                    status={status}
                    name="change_theme"
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
