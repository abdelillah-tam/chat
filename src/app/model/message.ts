export interface Message {
  messageText: string;
  senderId: string;
  receiverId: string;
  timestamp: number;
  type: 'image' | 'text' | 'image and text';
  imageUrl: string;
  channel: string;
}
