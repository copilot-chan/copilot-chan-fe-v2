'use client';

import MCPToolCall from './UIToolCall';

// ==========================================
// Types
// ==========================================

interface FunctionResponseData {
    type: 'functionResponse';
    name: string;
    response: any; // User requested any for simplicity
}

interface FunctionResponseRendererProps {
    data: FunctionResponseData;
}

// ==========================================
// Component
// ==========================================

export function FunctionResponseRenderer({
    data,
}: FunctionResponseRendererProps) {
    return (
        <MCPToolCall
            status="complete"
            name={data.name}
            args={undefined}
            result={data.response}
        />
    );
}

// ==========================================
// Parser Utility
// ==========================================

/**
 * Parse message content thành FunctionResponseData
 * Production-ready với comprehensive validation
 */
export function parseFunctionResponse(
    content: string
): FunctionResponseData | null {
    // Guard: empty content
    if (!content || content.trim() === '') {
        return null;
    }

    try {
        const parsed = JSON.parse(content) as unknown;

        // Type guard với comprehensive checks
        if (
            typeof parsed !== 'object' ||
            parsed === null ||
            !('type' in parsed) ||
            parsed.type !== 'functionResponse' ||
            !('name' in parsed) ||
            typeof parsed.name !== 'string' ||
            !('response' in parsed)
        ) {
            return null;
        }

        return parsed as FunctionResponseData;
    } catch (error) {
        // Production: Log parsing errors for debugging
        if (process.env.NODE_ENV === 'development') {
            console.warn('Failed to parse functionResponse:', error);
        }
        return null;
    }
}
