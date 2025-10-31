import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useState, useRef } from "react";
import type { ChatMessage } from "../types/Chat.types";

export default function useChatConnection(roomId: number, username: string) {
  const stompClientRef = useRef<Client | null>(null);
  const [error, setError] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageSubscriptionRef = useRef<StompSubscription | null>(null);
  const historySubscriptionRef = useRef<StompSubscription | null>(null);
  const roomIdRef = useRef<number>(roomId);

  function connect() {
    setError("");

    try {
      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws") as WebSocket,
        onConnect: () => onConnected(),
        onStompError: (frame) => onError(frame),
        debug: () => { },
      });
      client.activate();
      stompClientRef.current = client;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError("Connection failed: " + errorMessage);
    }
  }

  function onConnected() {
    setConnected(true);
    setError("");
    subscribe();
  }

  function subscribe() {
    if (stompClientRef.current) {
      messageSubscriptionRef.current = stompClientRef.current.subscribe("/chatroom/" + roomIdRef.current, onMessageReceived);
      historySubscriptionRef.current = stompClientRef.current.subscribe("/chatroom/" + roomIdRef.current + "/history", onHistoryReceived);
      stompClientRef.current.publish({
        destination: "/app/join/" + roomIdRef.current,
        body: JSON.stringify({}),
      });
    }
  }

  function unsubscribe() {
    messageSubscriptionRef.current?.unsubscribe();
    historySubscriptionRef.current?.unsubscribe();
    setMessages([]);
  }

  function onRoomSwap(newRoomId: number) {
    roomIdRef.current = newRoomId;
    unsubscribe();
    subscribe();
  }

  function onError(error: any) {
    console.error("Connection error:", error);
    setConnected(false);
    setError("Connection failed. Is the backend running?");
  }

  function onMessageReceived(message: IMessage) {
    const payloadData: ChatMessage = JSON.parse(message.body);
    setMessages(msgs => [...msgs, payloadData]);
  }

  function onHistoryReceived(message: IMessage) {
    const history: ChatMessage[] = JSON.parse(message.body);
    setMessages(history);
  }

  function sendMessage(messageText: string) {
    if (messageText.trim() && stompClientRef.current) {
      const chatMessage: ChatMessage = {
        senderName: username,
        message: messageText,
        roomId: roomIdRef.current,
      };
      stompClientRef.current.publish({
        destination: "/app/message/" + roomIdRef.current,
        body: JSON.stringify(chatMessage),
      });
    }
  }


  return { connect, error, connected, messages, sendMessage, onRoomSwap, };

}

