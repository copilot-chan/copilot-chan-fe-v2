export type UIRole = "user" | "assistant" | "system" ;

export interface UITextMessage {
  id: string;
  kind: "text";
  role: UIRole;
  text: string;
}

export interface UIToolCallMessage {
  id: string;
  kind: "tool";
  role: "assistant";
  tool: {
    type: "call";
    name: string;
    arguments: unknown;
  };
}

export interface UIToolResultMessage {
  id: string;
  kind: "tool";
  role: "assistant";
  tool: {
    type: "result";
    name: string;
    result: unknown;
  };
}


export type UIMessage = UITextMessage | UIToolCallMessage | UIToolResultMessage;

export interface UIChatData {
  messages: UIMessage[];
}

// ==========================================
// Type Guards - Safe type narrowing
// ==========================================

export function isTextMessage(msg: UIMessage): msg is UITextMessage {
  return msg.kind === "text";
}

export function isToolMessage(msg: UIMessage): msg is UIToolCallMessage {
  return msg.kind === "tool" ;
}