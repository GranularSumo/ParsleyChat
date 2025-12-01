import ChatHeader from "./ChatHeader";
import ChatInputArea from "../input/ChatInputArea";
import MessageWindow from "../messages/MessageWindow";
import { useConnectionContext } from "../../contexts/ConnectionContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function ChatWindow() {

  const connectionContext = useConnectionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!connectionContext.connected) {
      navigate("/login");
    }
  }, [connectionContext.connected, navigate]);

  return (
    <div className="w-full h-full bg-black">
      <div className="w-full h-full bg-black border border-green-500 shadow-2xl flex flex-col overflow-hidden">

        <ChatHeader
          connected={connectionContext.connected}
          roomName={connectionContext.roomName}
          username={connectionContext.username}
        />

        <MessageWindow messages={connectionContext.messages} username={connectionContext.username} />

        <ChatInputArea
          sendMessage={connectionContext.sendMessage}
        />

      </div>
    </div>
  );
}
