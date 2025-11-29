"use client";

import { CopilotActionRender } from "@/components/chat/actions/copilot-actions";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="flex-1 flex flex-col h-full">
      <CopilotActionRender />
      <ChatInterface chatId={id} />
    </div>
  );
}
