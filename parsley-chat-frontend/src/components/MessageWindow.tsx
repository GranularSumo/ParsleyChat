import { useEffect, useRef } from "react";
import type { UserData, ChatMessage } from "../types/Chat.types";

interface MessageWindowProps {
  messages: ChatMessage[];
  userData: UserData;
}

export default function MessageWindow({
  messages,
  userData,
}: MessageWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const chatMessages = messages.map((message, index) => {
    const isOwn = message.senderName === userData.senderName;
    return (
      <li key={index} className={`mb-4 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
          <div className={`text-sm mb-1 ${isOwn ? 'text-green-400' : 'text-cyan-400'}`}>
            {isOwn ? 'You@terminal' : `${message.senderName}@terminal`}
          </div>
          <div className="relative">
            <div className={`absolute message-pulse inset-1 rounded-sm ${isOwn ? 'bg-green-500' : 'bg-cyan-500'}`}></div>
            <div className={`relative border bg-black px-4 py-2 rounded whitespace-pre-wrap ${isOwn
              ? 'border-green-500 bg-black hover:bg-green-950 text-green-200'
              : 'border-cyan-500 bg-black hover:bg-cyan-900 text-cyan-200'
              }`}>
              {message.message}
            </div>
          </div>
        </div>
      </li>
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
