import ChatWindow from "../components/ChatWindow";
import ChatRoomList from "../components/ChatRoomList";


export default function ChatWindowLayout() {
  return (
    <>
      <div className="flex h-full">
        <ChatRoomList />
        <ChatWindow />
      </div>
    </>
  )
}
