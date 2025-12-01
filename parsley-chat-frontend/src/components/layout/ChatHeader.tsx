
interface ChatHeaderProps {
  connected: boolean;
  roomName: string;
  username: string;
}

export default function ChatHeader({
  roomName,
  username
}: ChatHeaderProps) {


  return (
    <>
      <div className="bg-green-900 border-b border-green-500 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-green-300 text-xl tracking-wider font-bold">
            <span>PARSLEY-CHAT</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-black border-b border-green-800 text-green-500 text-sm">
        <div className="relative overflow-hidden whitespace-nowrap items-center">
          <span className='relative z-10 bg-black pr-4'>| CURRENT CHATROOM: {roomName} | USER: {username} |</span>
        </div>
      </div>
    </>
  )
}
