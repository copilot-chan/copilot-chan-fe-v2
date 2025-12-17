import { ChatInterface } from "@/components/chat/ChatInterface";
import RegisterMCPServer from "@/components/chat/mcp/SetMCPServer";
import { CopilotActionRender } from "@/components/chat/actions/copilot-actions";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <CopilotActionRender />
      <RegisterMCPServer/>
      <ChatInterface />
    </main>
  );
}
