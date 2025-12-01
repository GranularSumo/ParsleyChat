import { useConnectionContext } from "../contexts/ConnectionContext";

//TODO: update the room li styling.


interface chatRoomProps {
  roomName: string;
  roomId: number;
}

export default function ChatRoom({
  roomName,
  roomId,
}: chatRoomProps) {

  const connectionContext = useConnectionContext();

  function handleClick() {
    connectionContext.setRoomId(roomId);
    connectionContext.setRoomName(roomName);
    connectionContext.onRoomSwap(roomId);
  }

  return (
    <li onClick={handleClick} key={roomId} className="bg-green-400 hover:bg-green-300 p-0.5">
      {roomName}
    </li>
  )
}
