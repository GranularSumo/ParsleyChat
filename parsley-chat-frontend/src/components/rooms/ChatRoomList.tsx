import ChatRoom from "./ChatRoom";

//TODO: remove the client initialised chatrooms and grab the roomList from the backend on connection instead.
//      also update the backend logic in the process.

export default function ChatRoomList() {

  const rooms = ["This is a chat room", "Another chat room", "I can't think of good names to test this out."];

  const roomList = rooms.map((room, index) => {
    return (
      <ChatRoom
        roomName={room}
        roomId={index}
        key={index}
      />
    )
  })

  return (
    <>
      <div className="bg-green-900 w-1/8 border border-r-0 border-green-500 p-2">
        <ul className="flex flex-col gap-1">
          {roomList}
        </ul>
      </div>
    </>
  )
}
