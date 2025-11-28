export interface UserData {
  senderName: string;
  connected: boolean;
  roomId: number;
}


export interface ChatMessage {
  id?: number;
  senderName: string;
  content: string;
  roomId: number;
  timestamp?: string;
}
