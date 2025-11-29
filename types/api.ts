// ===========================
// Chat API Types (Clean & Minimal)
// ===========================

/**
 * Message trong một conversation
 */
export interface Message {
  id?: string;
  author: string; // "user" hoặc "model"
  content: {
    text?: string;
    parts?: any[]; // Cho phép cấu trúc phức tạp từ backend (files, function calls)
    [key: string]: any;
  };
  timestamp?: number; // Unix timestamp (ms)
  errorMessage?: string;
}

interface ChatState {
  title?: string;
  [key: string]: any;
}

/**
 * Session - Một cuộc trò chuyện (conversation)
 */
export interface Session {
  id: string;
  appName: string;
  userId: string;
  events?: Message[]; // Danh sách messages
  state: ChatState;
  createTime: number;
  updateTime: number;
}

/**
 * Chat - Alias cho Session (để tương thích ngược nếu cần)
 */
export type Chat = Session;

/**
 * API Response Types
 */
export interface ListChatsResponse {
  sessions: Session[];
}

export interface GetChatResponse extends Session {}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface Memory {
  id: string;
  memory: string; // 'memory' trong API gốc
  metadata?: any;
  categories?: string[];
  created_at: string;
  updated_at?: string;
  expiration_date?: string | null;
  structured_attributes?: Record<string, any>;
  [key: string]: any;
}

export interface MemoriesResponse {
  results: Memory[];
  count: number;
  page: number;
  page_size: number;
  has_more?: boolean;
}

export interface GetMemoriesParams {
  page?: number;
  pageSize?: number;
  authorization: string;
}

export interface DeleteMemoryParams {
  memoryId: string;
  authorization: string;
}

// ==========================================
// Message Part Type Definitions (Extensible)
// ==========================================

/**
 * FunctionResponse structure từ API
 */
export interface FunctionResponse {
  id: string;
  name: string;
  response: any; // Flexible for any response structure
}

/**
 * Text part
 */
export interface TextPart {
  text: string;
}

/**
 * FunctionResponse part
 */
export interface FunctionResponsePart {
  functionResponse: FunctionResponse;
}

/**
 * Future: Image part (placeholder)
 */
export interface ImagePart {
  image: {
    url: string;
    caption?: string;
  };
}

/**
 * Future: Video part (placeholder)
 */
export interface VideoPart {
  video: {
    url: string;
    thumbnail?: string;
  };
}

/**
 * Union type cho tất cả part types
 * Dễ dàng extend bằng cách add vào union
 */
export type MessagePart =
  | TextPart
  | FunctionResponsePart
  | ImagePart
  | VideoPart;

// ==========================================
// Type Guards
// ==========================================

/**
 * Check if part is TextPart
 */
export function isTextPart(part: MessagePart): part is TextPart {
  return "text" in part && typeof part.text === "string";
}

/**
 * Check if part is FunctionResponsePart
 */
export function isFunctionResponsePart(
  part: MessagePart
): part is FunctionResponsePart {
  return (
    "functionResponse" in part &&
    part.functionResponse !== null &&
    typeof part.functionResponse === "object" &&
    "name" in part.functionResponse
  );
}

/**
 * Check if part is ImagePart
 */
export function isImagePart(part: MessagePart): part is ImagePart {
  return "image" in part && typeof part.image === "object";
}

/**
 * Check if part is VideoPart
 */
export function isVideoPart(part: MessagePart): part is VideoPart {
  return "video" in part && typeof part.video === "object";
}

// ==========================================
// Updated Message Content Structure
// ==========================================

/**
 * Message content structure với typed parts
 */
export interface MessageContent {
  role?: string;
  parts?: MessagePart[];
  [key: string]: unknown;
}
