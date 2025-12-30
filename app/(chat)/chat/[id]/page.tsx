"use client";

import { CopilotActionRender } from "@/components/chat/actions/copilot-actions";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <CopilotActionRender />
      <ChatInterface chatId={id} />
    </div>
  );
}
