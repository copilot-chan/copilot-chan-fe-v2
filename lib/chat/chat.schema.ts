import { z } from "zod";

export const TextPartSchema = z.object({
  text: z.string(),
});

export const AnyPartSchema = z.record(z.any());

export const EventPartSchema = z.union([
  TextPartSchema,
  AnyPartSchema,
]);

export const ChatEventSchema = z.object({
  invocationId: z.string().optional(),
  author: z.string().optional(),
  content: z.object({
    role: z.string().optional().default("model"),
    parts: z.array(z.any()).default([]),
  }).optional(),
  actions: z.any().optional(),
}).passthrough();

export const BackendChatSchema = z.object({ 
  id: z.string(),
  appName: z.string().optional(),
  userId: z.string().optional(),
  state: z.any().optional(),
  lastUpdateTime: z.any().optional(),
  events: z.array(ChatEventSchema).default([]),
}).passthrough();

export type BackendChat = z.infer<typeof BackendChatSchema>;
export type ChatEvent = z.infer<typeof ChatEventSchema>;
