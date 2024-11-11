export interface Message {
  messageText: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  type: 'image' | 'text' | 'image and text';
  imageUrl: string;
}
