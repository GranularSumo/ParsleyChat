import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import useChatConnection from "../hooks/useChatConnection";
import type { ChatMessage } from "../types/Chat.types";

//TODO: I think some of this can be cleaned up now because of the refactor, but I will have to look into it further.

interface ConnectionContextType {
  connect: () => void;
  sendMessage: (messageText: string) => void;
  error: string;
  messages: ChatMessage[];
  connected: boolean;
  username: string;
  setUsername: (username: string) => void;
  roomId: number;
  roomName: string;
  setRoomName: (roomName: string) => void;
  setRoomId: (roomId: number) => void;
  onRoomSwap: (roomId: number) => void;
}

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export function ConnectionProvider({ children }: { children: ReactNode }) {

  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(0);
  const connection = useChatConnection(roomId, username);
  const [roomName, setRoomName] = useState("");
  const contextValue: ConnectionContextType = {
    ...connection,
    username,
    setUsername,
    roomId,
    roomName,
    setRoomName,
    setRoomId,
  };

  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  )
}

export function useConnectionContext() {
  const context = useContext(ConnectionContext);

  if (!context) {
    throw new Error('useConnection must be used within ConnectionProvider');
  }

  return context;
}

