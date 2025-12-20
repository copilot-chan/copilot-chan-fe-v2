import { UITextMessage } from "@/lib/chat";
import { Markdown, UserMessageProps } from "@copilotkit/react-ui";

export function TextMessage({ msg }: { msg: UITextMessage }) {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`w-fit p-2 rounded-lg bg-red-500 ${isUser?'bg-secondary px-3':''}`}>
                <Markdown content={msg.text} />
            </div>
        </div>
    );
}



// export const CustomUserMessage = (props: UserMessageProps) => {
//     const { message, ImageRenderer } = props;

//     return (
//         <div className="">
//             <Markdown content={props.message?.content || " "} />
//         </div>
//     );
// };
