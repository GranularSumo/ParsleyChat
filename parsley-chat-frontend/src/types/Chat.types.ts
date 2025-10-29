export interface UserData {
  senderName: string;
  connected: boolean;
  roomId: number;
  message: string;
}


export interface ChatMessage {
  senderName: string;
  message: string;
  roomId: number;
}
