export { BackendChatSchema, ChatEventSchema } from "./chat.schema";
export type { BackendChat, ChatEvent } from "./chat.schema";

// Type exports (for UI)
export type {
  UIMessage,
  UITextMessage,
  UIToolCallMessage,
  UIToolResultMessage,
  UIChatData,
  UIRole,
} from "./types";

// Type guards
export {
  isTextMessage,
  isToolMessage,
} from "./types";

// Normalizer
export { normalizeChat } from "./normalizer";
