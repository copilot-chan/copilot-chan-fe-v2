import { Markdown, UserMessageProps } from "@copilotkit/react-ui";

type UserMessageContent = NonNullable<UserMessageProps["message"]>["content"];

const getTextContent = (content: UserMessageContent | undefined): string | undefined => {
  if (typeof content === "undefined") {
    return undefined;
  }

  if (typeof content === "string") {
    return content;
  }

  return (
    content
      .map((part) => {
        if (part.type === "text") {
          return part.text;
        }
        return undefined;
      })
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .join(" ")
      .trim() || undefined
  );
};

export const CustomUserMessage = (props: UserMessageProps) => {

  const { message, ImageRenderer } = props;
  const isImageMessage = message && "image" in message && Boolean(message.image);

  return (
      <div className="flex justify-end">
          <div className="w-fit bg-secondary rounded-lg p-2 px-3 break-words whitespace-pre-wrap">
              {isImageMessage ? (
                  <ImageRenderer
                      image={message.image!}
                      content={getTextContent(message?.content)}
                  />
              ) : (
                  <Markdown content={getTextContent(message?.content) || ' '} />
              )}
          </div>
      </div>
  );
};
