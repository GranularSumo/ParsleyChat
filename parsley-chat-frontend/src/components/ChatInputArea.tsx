import type { ChangeEvent } from "react";

interface ChatInputAreaProps {
  message: string;
  handleMessageInput(event: ChangeEvent<HTMLTextAreaElement>): void;
  handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void;
  handleSend(): void;
}


export default function ChatInputArea({
  message,
  handleMessageInput,
  handleKeyDown,
  handleSend
}: ChatInputAreaProps) {

  return (
    <>
      <div className="bg-green-950 border-t border-green-500 p-4">
        <div className="flex items-start gap-2">
          <span className="text-green-400 text-xl shrink-0">&gt;_</span>
          <textarea
            className="flex-1 p-1 bg-black rounded-lg text-green-300 text-lg outline-none resize-none placeholder-green-700 min-h-[60px]"
            placeholder="Enter message..."
            value={message}
            onChange={handleMessageInput}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button
            type="button"
            onClick={handleSend}
            className="bg-green-700 mt-5 hover:bg-green-600 shadow-sm/30 hover:shadow-md/50 font-bold px-6 py-2 border-green-400 rounded-lg transition-colors text-gray-100 text-lg tracking-wider"
          >
            SEND
          </button>
        </div>

        <div className="text-white opacity-50 text-xs mt-2">
          Press ENTER to send | SHIFT+ENTER for new line
        </div>
      </div>
    </>
  )
}
