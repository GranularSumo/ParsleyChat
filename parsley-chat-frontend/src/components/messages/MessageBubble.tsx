import type { ChatMessage } from "../../types/Chat.types";

interface MessageBubbleProps {
  isOwn: boolean;
  animationDelay: string;
  message: ChatMessage;
}

export default function MessageBubble({
  isOwn,
  animationDelay,
  message
}: MessageBubbleProps) {


  return (
    <li className={`mb-4 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`text-sm mb-1 ${isOwn ? 'text-green-400' : 'text-cyan-400'}`}>
          {isOwn ? `You` : `${message.senderName}`}
        </div>
        <div className="relative">
          <div className={`absolute message-pulse inset-1 rounded-sm ${isOwn ? 'bg-green-500' : 'bg-cyan-500'}`} style={{ animationDelay }}></div>
          <div className={`relative border bg-black px-4 py-2 rounded whitespace-pre-wrap ${isOwn
            ? 'border-green-500 bg-black hover:bg-green-950 text-green-200'
            : 'border-cyan-500 bg-black hover:bg-cyan-900 text-cyan-200'
            }`}>
            {message.content}
          </div>
        </div>
      </div>
    </li >
  )
}
