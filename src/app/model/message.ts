export class Message {
    messageText: string;
    senderId: string;
    receiverId: string;
    timestamp: string;

    constructor(messageText: string, senderId: string, receiverId: string, timestamp: string) {
        this.messageText = messageText;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.timestamp = timestamp;
    }
}