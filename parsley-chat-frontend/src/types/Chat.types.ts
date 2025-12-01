export interface UserData {
  senderName: string;
  connected: boolean;
  roomId: number;
}


export interface ChatMessage {
  senderName: string;
  message: string;
  roomId: number;
}
