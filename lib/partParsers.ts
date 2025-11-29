import { Message as CopilotMessage, TextMessage, Role } from '@copilotkit/runtime-client-gql';
import { MessagePart, isTextPart, isFunctionResponsePart, Message } from '@/types/api';

/**
 * Base parser result
 */
interface ParseResult {
    messages: CopilotMessage[];
    handled: boolean;
}

/**
 * Parser context (shared data for all parsers)
 */
interface ParserContext {
    messageId: string;
    author: string;
    timestamp?: number;
}

/**
 * Part parser interface (extensible cho future types)
 */
type PartParser = (part: MessagePart, ctx: ParserContext) => ParseResult;

// ==========================================
// Individual Part Parsers
// ==========================================

/**
 * Parse text parts
 */
const parseTextPart: PartParser = (part, ctx) => {
    if (!isTextPart(part)) {
        return { messages: [], handled: false };
    }

    if (!part.text.trim()) {
        return { messages: [], handled: true };
    }

    const message = new TextMessage({
        id: ctx.messageId,
        role: ctx.author === 'user' ? Role.User : Role.Assistant,
        content: part.text,
        createdAt: ctx.timestamp ? new Date(ctx.timestamp * 1000) : new Date(),
    });

    return { messages: [message], handled: true };
};

/**
 * Parse functionResponse parts
 */
const parseFunctionResponsePart: PartParser = (part, ctx) => {
    if (!isFunctionResponsePart(part)) {
        return { messages: [], handled: false };
    }

    const { functionResponse } = part;

    // Embed as JSON để renderer detect
    const message = new TextMessage({
        id: functionResponse.id || ctx.messageId,
        role: Role.Assistant,
        content: JSON.stringify({
            type: 'functionResponse',
            name: functionResponse.name,
            response: functionResponse.response,
        }),
        createdAt: ctx.timestamp ? new Date(ctx.timestamp * 1000) : new Date(),
    });

    return { messages: [message], handled: true };
};

/**
 * Future: Parse image parts
 */
const parseImagePart: PartParser = (part, ctx) => {
    // TODO: Implement when needed
    return { messages: [], handled: false };
};

/**
 * Future: Parse video parts
 */
const parseVideoPart: PartParser = (part, ctx) => {
    // TODO: Implement when needed
    return { messages: [], handled: false };
};

// ==========================================
// Parser Registry (Easy to extend)
// ==========================================

const PART_PARSERS: PartParser[] = [
    parseTextPart,
    parseFunctionResponsePart,
    parseImagePart,
    parseVideoPart,
];

// ==========================================
// Public API
// ==========================================

/**
 * Parse single message part
 * Automatically routes to correct parser
 */
export function parsePart(part: MessagePart, ctx: ParserContext): CopilotMessage[] {
    for (const parser of PART_PARSERS) {
        const result = parser(part, ctx);
        if (result.handled) {
            return result.messages;
        }
    }

    // Fallback: unhandled part type
    if (process.env.NODE_ENV === 'development') {
        console.warn('Unhandled part type:', part);
    }
    return [];
}

/**
 * Parse entire API message
 */
export function parseMessage(msg: Message): CopilotMessage[] {
    const ctx: ParserContext = {
        messageId: msg.id || crypto.randomUUID(),
        author: msg.author,
        timestamp: msg.timestamp,
    };

    if (!msg.content?.parts || msg.content.parts.length === 0) {
        return [];
    }

    // Parse all parts and flatten
    return msg.content.parts.flatMap((part) => parsePart(part, ctx));
}

/**
 * Parse multiple messages
 */
export function parseMessages(messages: Message[]): CopilotMessage[] {
    return messages.flatMap(parseMessage);
}
