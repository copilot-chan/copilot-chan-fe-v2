import { UIToolCallMessage, UIToolResultMessage } from "@/lib/chat";
import MCPToolCall from "../../ui/UIToolCall";

export function ToolMessage({ msg }: { msg: UIToolCallMessage | UIToolResultMessage }) {
    return (
        <div className="flex justify-start mb-2">
            <MCPToolCall status={'complete'} name={msg.tool.name} args={msg.tool.type === 'call' ? msg.tool.arguments : undefined} result={msg.tool.type === 'result' ? msg.tool.result : undefined}/>
        </div>
    );
}