import logo from '../assets/ChatGPT Image Oct 27, 2025, 09_09_33 AM.png';

interface ChatHeaderProps {
  connected: boolean;
  roomName: string;
  username: string;
}

export default function ChatHeader({
  connected,
  roomName,
  username
}: ChatHeaderProps) {

  const scrollingText = "01001011 01101110 01101111 01110111 00100000 01010111 01101000 01100001 01110100 00111111 00100000 01011001 01101111 01110101 00100111 01110010 01100101 00100000 01010011 01110100 01100001 01110010 01110100 01101001 01101110 01100111 00100000 01010100 01101111 00100000 01010010 01100101 01101101 01101001 01101110 01100100 00100000 01001101 01100101 00100000 01001111 01100110 00100000 01001101 01100101 00101110 00101110 00101110 00100000 01000110 01101001 01100110 01110100 01111001 00100000 01011001 01100101 01100001 01110010 01110011 00100000 01000010 01100001 01100011 01101011 00101110 00100000 01001101 01101001 01101110 01110101 01110011 00100000 01010100 01101000 01100101 00100000 01000011 01101000 01100001 01110010 01101001 01110011 01101101 01100001 00101110 00101110 00101110 00100000 01000001 01101110 01100100 00100000 01001001 01101101 01110000 01110010 01100101 01110011 01110011 01101001 01110110 01100101 00100000 00100011 00100011 00100011 00100011 00101110"

  return (
    <>
      <div className="bg-green-900 border-b border-green-500 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-8 h-8 object-cover rounded-full rotate-45" />
          <div className="text-green-300 text-xl tracking-wider font-bold">
            <span>PARSLEY-CHAT</span>
            <span className="text-xs font-thin text-white opacity-50">v9000.001</span>
            <p className="text-xs text-white opacity-50">Yes, it is over 9000.</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
          <span className="text-green-300 text-sm">
            {connected ? 'CONNECTED' : 'OFFLINE...'}
          </span>
        </div>
      </div>

      <div className="px-4 py-2 bg-black border-b border-green-800 text-green-500 text-sm">
        <div className="relative overflow-hidden whitespace-nowrap items-center">
          <span className='relative z-10 bg-black pr-4'>| CURRENT CHATROOM: {roomName} | USER: {username} |</span>
          <span className='text-xs opacity-50 absolute left-0 top-1 animate-ticker'>{scrollingText}</span>
        </div>
      </div>
    </>
  )
}
