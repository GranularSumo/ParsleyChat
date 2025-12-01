import ChatWindow from "../components/layout/ChatWindow";
import ChatRoomList from "../components/rooms/ChatRoomList";


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
