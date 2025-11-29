"use client";

import { createContext, useContext, useState } from "react";

interface OptimisticChatContextType {
  optimisticSessions: Set<string>;
  addOptimisticSession: (sessionId: string) => void;
  removeOptimisticSession: (sessionId: string) => void;
  isOptimistic: (sessionId: string) => boolean;
}

const OptimisticChatContext = createContext<
  OptimisticChatContextType | undefined
>(undefined);

export function OptimisticChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [optimisticSessions, setOptimisticSessions] = useState<Set<string>>(
    new Set()
  );

  const addOptimisticSession = (sessionId: string) => {
    setOptimisticSessions((prev) => new Set([...prev, sessionId]));

    // Auto-remove sau 3s (đảm bảo revalidation đã xong)
    setTimeout(() => {
      removeOptimisticSession(sessionId);
    }, 3000);
  };

  const removeOptimisticSession = (sessionId: string) => {
    setOptimisticSessions((prev) => {
      const next = new Set(prev);
      next.delete(sessionId);
      return next;
    });
  };

  const isOptimistic = (sessionId: string) => optimisticSessions.has(sessionId);

  return (
    <OptimisticChatContext.Provider
      value={{
        optimisticSessions,
        addOptimisticSession,
        removeOptimisticSession,
        isOptimistic,
      }}
    >
      {children}
    </OptimisticChatContext.Provider>
  );
}

export function useOptimisticChat() {
  const context = useContext(OptimisticChatContext);
  if (!context) {
    throw new Error(
      "useOptimisticChat must be used within OptimisticChatProvider"
    );
  }
  return context;
}
