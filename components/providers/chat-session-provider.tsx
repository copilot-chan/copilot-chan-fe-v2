"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";

interface ChatSessionContextType {
  sessionId: string;
  generateNewSession: () => void;
}

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(
  undefined
);

export function ChatSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // If we are on a specific chat page, use that ID
    if (params?.id && typeof params.id === "string") {
      setSessionId(params.id);
    }
    // If we are on the new chat page (root), always generate a new ID if we landed here
    else if (pathname === "/") {
      setSessionId(crypto.randomUUID());
    }
  }, [params?.id, pathname]);

  const generateNewSession = () => {
    setSessionId(crypto.randomUUID());
  };

  return (
    <ChatSessionContext.Provider value={{ sessionId, generateNewSession }}>
      {children}
    </ChatSessionContext.Provider>
  );
}

export function useChatSession() {
  const context = useContext(ChatSessionContext);
  if (context === undefined) {
    throw new Error("useChatSession must be used within a ChatSessionProvider");
  }
  return context;
}
