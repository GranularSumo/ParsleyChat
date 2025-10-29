import { useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import LoginScreen from "./LoginScreen";
import ChatHeader from "./ChatHeader";
import ChatInputArea from "./ChatInputArea";
import MessageWindow from "./MessageWindow";
import type { ChatMessage, UserData } from "../types/Chat.types";


/*
 * TODO: extract the websocket logic into a separate hook.
 * TODO: extract the message state logic into a separate hook.
 * TODO: implement the ChatRoomList logic.
 * TODO: rename this component to be: ChatRoom?
 * TODO: remove the logic for the LoginScreen because that should be handled with the router.
 * TODO: the stompClient should be handled with state management.
 */

let stompClient: Client | null = null;

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userData, setUserData] = useState<UserData>({
    senderName: "",
    message: "",
    connected: false,
    roomId: 1,
  });
  const [error, setError] = useState<string>("");


  // this sets up the websocket connection.
  function connect() {
    setError("");

    try {
      stompClient = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws") as WebSocket,
        onConnect: () => onConnected(),
        onStompError: (frame) => onError(frame),
        debug: (str) => {
          console.log('STOMP debug:', str);
        },
      });

      stompClient.activate();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError("Connection failed: " + errorMessage);
    }
  }

  // when the client connects to the backend it subscribes to the chatroom history and the topic that handles new messages
  // and then retrieves the chat history to populate the chat window. I think there is a race condition that needs fixing here...
  // but yeah i was just playing around with this to try to get something working, so this will probably need refactoring too.
  // there is currently no way to switch to different chat rooms, because the default roomId is set to 1 up there ^^ in the userData.
  // but im pretty sure the backend is set up to handle multiple chatrooms.
  function onConnected() {
    setUserData(prev => ({ ...prev, connected: true }));
    setError("");

    if (stompClient) {
      // I probably could have thought of better endpoints for the mappings, but we can have a think about this as we work on the
      // system design.
      stompClient.subscribe("/chatroom/" + userData.roomId, onMessageReceived);
      stompClient.subscribe("/chatroom/" + userData.roomId + "/history", onHistoryReceived);
      stompClient.publish({
        destination: "/app/join/" + userData.roomId,
        body: JSON.stringify({}),
      });
    }
  }

  // I kept forgetting to run the spring boot app, and Claude called me out here when I was trying to get it to help me figure out what was wrong :P
  function onError(error: any) {
    console.error("Connection error:", error);
    setUserData(prev => ({ ...prev, connected: false }));
    setError("Connection failed. Is the backend running?");
  }

  // when an update comes in it gets added to the end of the messages array.
  function onMessageReceived(message: IMessage) {
    const payloadData: ChatMessage = JSON.parse(message.body);
    console.log("Received message:", payloadData);
    setMessages(msgs => [...msgs, payloadData]);
  }

  // when the initial chat history comes in it sets the Messages[] as the array recieved.
  // as i said up there ^^ I think there might be a race condition that needs fixing here because if a new message comes in 
  // at the same time as the chat history, we might lose the message?
  function onHistoryReceived(message: IMessage) {
    const history: ChatMessage[] = JSON.parse(message.body);
    console.log("Received history:", history);
    setMessages(history);
  }



  function handleMessageInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target;
    setUserData(userData => ({ ...userData, message: value }));
  }

  function handleUsernameInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setUserData(userData => ({ ...userData, senderName: value }));
  }

  // This posts the message, again, I believe I set it up correctly to be able to accomodate multiple chatrooms,
  // but I guess we will see.
  function handleSend() {
    if (userData.message.trim() && stompClient) {
      const currentDate = new Date();
      const chatMessage: ChatMessage = {
        senderName: userData.senderName,
        message: userData.message,
        roomId: userData.roomId,
      };
      console.log("Sending message:", chatMessage);
      stompClient.publish({
        destination: "/app/message/" + userData.roomId,
        body: JSON.stringify(chatMessage),
      });
      setUserData(userData => ({ ...userData, message: "" }));
    }
  }

  function handleConnect() {
    if (userData.senderName.trim()) {
      connect();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  // I don't think I really like how TailwindCSS looks :/ this seeems very messy to me...

  // Also the login screen is currently embedded in the chat window which is not ideal, it was originally in the same file
  // but I started splitting it out when I transferred from my test project, and then ran out of time before I could set up
  // react router to set up a better solution, so this needs to be changed.
  return (
    <div className="w-full h-full bg-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        * {
          font-family: 'VT323', monospace;
        }
      `}</style>

      {!userData.connected ? (
        <LoginScreen
          username={userData.senderName}
          error={error}
          onUsernameChange={handleUsernameInput}
          onConnect={handleConnect}
        />
      ) : (
        <div className="w-full h-full bg-black border border-green-500 rounded-lg shadow-2xl flex flex-col overflow-hidden">

          <ChatHeader
            connected={userData.connected}
            roomId={userData.roomId}
            username={userData.senderName}
          />

          <MessageWindow messages={messages} userData={userData} />

          <ChatInputArea
            message={userData.message}
            handleMessageInput={handleMessageInput}
            handleKeyDown={handleKeyDown}
            handleSend={handleSend}
          />

        </div>
      )}
    </div>
  );
}
