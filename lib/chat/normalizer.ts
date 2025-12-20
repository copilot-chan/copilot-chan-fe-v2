import type { BackendChat } from "./chat.schema";
import type { UIMessage, UIChatData, UIRole } from "./types";


function toUIRole(backendRole: string|undefined): UIRole {
  if (backendRole==="user") return "user"
  return "assistant"
}

export function normalizeChat(raw: BackendChat): UIChatData {
  const messages: UIMessage[] = [];

  if (!raw.events) {
    return { messages };
  }

  for (const event of raw.events) {
    if (!event.content?.parts) {
      continue;
    }

    // Use invocationId from backend, fallback to random uuid
    const eventId = event.invocationId || crypto.randomUUID();
    // Role có thể undefined, dùng author hoặc default assistant
    const role = toUIRole(event.content.role);

    for (const part of event.content.parts) {

      if (!part) continue;
      
      // ===== TEXT =====
      if ("text" in part && typeof part.text === "string") {
        const text = part.text.trim();
        if (!text) continue;

        messages.push({
          id: eventId,
          kind: "text",
          role,
          text,
        });
        continue;
      }

      // ===== TOOL CALL =====
      if ("functionCall" in part && part.functionCall) {
        messages.push({
          id: eventId,
          kind: "tool",
          role: "assistant",
          tool: {
            type: "call",
            name: part.functionCall.name,
            arguments: part.functionCall.arguments,
          },
        });
        continue;
      }

      // ===== TOOL RESULT =====
      if ("functionResponse" in part && part.functionResponse) {
        messages.push({
          id: eventId,
          kind: "tool",
          role: "assistant",
          tool: {
            type: "result",
            name: part.functionResponse.name,
            result: part.functionResponse.response,
          },
        });
        continue;
      }

      // Unknown part type - skip silently in production
      if (process.env.NODE_ENV === "development") {
        console.warn("[normalizeChat] Unknown part type:", part);
      }
    }
  }

  return { messages };
}

// ==========================================
// Re-exports for convenience
// ==========================================

export type { UIMessage, UIChatData, UIRole } from "./types";
export type { BackendChat } from "./chat.schema";
