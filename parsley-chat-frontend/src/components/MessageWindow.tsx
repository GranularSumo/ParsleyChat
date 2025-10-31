import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/Chat.types";
import MessageBubble from "./MessageBubble";

//TODO: need to set up a way to paginate the message history because its currently just grabbing everything in one go.
//TODO: should also think about how the different chat rooms are handling messages, because currently we are only
//      grabbing messages for one chat room at a time, which wont allow for message previews and notifications etc.
//      but that might need to be handled via a different process.

interface MessageWindowProps {
  messages: ChatMessage[];
  username: string;
}

export default function MessageWindow({
  messages,
  username,
}: MessageWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageAnimationDelays = useRef(new Map<number, string>()).current;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const chatMessages = messages.map((message, index) => {
    const isOwn = message.senderName === username;

    if (!messageAnimationDelays.has(index)) {
      messageAnimationDelays.set(index, `${-(Date.now() % 2000)}ms`);
    }
    const animationDelay = messageAnimationDelays.get(index)!;

    return (
      <MessageBubble
        key={index}
        isOwn={isOwn}
        animationDelay={animationDelay}
        message={message}
      />
    );
  });


  return (
    <>
      <div className="flex-1 overflow-y-auto bg-black p-4">
        <ul className="space-y-2">
          {chatMessages}
          <div ref={messagesEndRef} />
        </ul>
      </div>
    </>
  )
}
