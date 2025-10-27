import { useState, useEffect, useRef } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import logo from "../assets/ChatGPT Image Oct 27, 2025, 09_09_33 AM.png";
import LoginScreen from "./LoginScreen";

interface ChatMessage {
  senderName: string;
  message: string;
  roomId: number;
}

interface UserData {
  senderName: string;
  message: string;
  connected: boolean;
  roomId: number;
}

let stompClient: Client | null = null;

export default function ChatWindow() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userData, setUserData] = useState<UserData>({
    senderName: "",
    message: "",
    connected: false,
    roomId: 1,
  });
  const [connecting, setConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // this sets up the websocket connection.
  function connect() {
    setConnecting(true);
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

      setTimeout(() => {
        if (!userData.connected && connecting) {
          setError("Failed to connect. Make sure the backend is running on port 8080.");
          setConnecting(false);
        }
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError("Connection failed: " + errorMessage);
      setConnecting(false);
    }
  }

  // when the client connects to the backend it subscribes to the chatroom history and the topic that handles new messages
  // and then retrieves the chat history to populate the chat window. I think there is a race condition that needs fixing here...
  // but yeah i was just playing around with this to try to get something working, so this will probably need refactoring too.
  // there is currently no way to switch to different chat rooms, because the default roomId is set to 1 up there ^^ in the userData.
  // but im pretty sure the backend is set up to handle multiple chatrooms.
  function onConnected() {
    setUserData(prev => ({ ...prev, connected: true }));
    setConnecting(false);
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
    setConnecting(false);
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

  // this maps the messages in the array to display them in the chat window. I think we can come up with a much better way of doing this,
  // but this was how it was done in the article that I read to initially set this up.
  const chatMessages = messages.map((message, index) => {
    const isOwn = message.senderName === userData.senderName;
    return (
      <li key={index} className={`mb-4 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
          <div className={`text-sm mb-1 ${isOwn ? 'text-green-400' : 'text-cyan-400'}`}>
            {isOwn ? 'You@terminal' : `${message.senderName}@terminal`}
          </div>
          <div className={`px-4 py-2 rounded border-2 ${isOwn
            ? 'bg-green-900 border-green-500 text-green-200'
            : 'bg-cyan-900 border-cyan-500 text-cyan-200'
            }`}>
            {message.message}
          </div>
        </div>
      </li>
    );
  });

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
          connecting={connecting}
          error={error}
          onUsernameChange={handleUsernameInput}
          onConnect={handleConnect}
        />
      ) : (
        <div className="w-full h-full bg-black border-4 border-green-500 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-green-900 border-b-2 border-green-500 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-8 h-8 object-cover rounded-full rotate-45" />
              <div className="text-green-300 text-xl tracking-wider">
                PARSLEY-CHAT TERMINAL v9000.01
              </div>
            </div>
            <div className="flex gap-2">
              <div className={`w-3 h-3 rounded-full ${userData.connected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-green-300 text-sm">
                {userData.connected ? 'CONNECTED' : 'DISCONNECTING...'}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-black p-4">
            <div className="text-green-500 mb-4 text-sm border-b border-green-800 pb-2">
              === CHATROOM #{userData.roomId} === USER: {userData.senderName} ===
            </div>
            <ul className="space-y-2">
              {chatMessages}
              <div ref={messagesEndRef} />
            </ul>
          </div>

          <div className="bg-green-950 border-t-2 border-green-500 p-4">
            <div className="flex items-start gap-2">
              <span className="text-green-400 text-xl mt-1 flex-shrink-0">&gt;_</span>
              <textarea
                className="flex-1 bg-transparent text-green-300 text-lg outline-none resize-none placeholder-green-700 min-h-[60px]"
                placeholder="Enter message..."
                value={userData.message}
                onChange={handleMessageInput}
                onKeyDown={handleKeyDown}
                rows={2}
              />
              <button
                type="button"
                onClick={handleSend}
                className="bg-green-700 hover:bg-green-600 text-black font-bold px-6 py-2 border-2 border-green-400 transition-colors text-lg tracking-wider"
              >
                SEND
              </button>
            </div>
            <div className="text-green-700 text-xs mt-2">
              Press ENTER to send | SHIFT+ENTER for new line
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
