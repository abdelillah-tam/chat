export class Message {
    messageText: string;
    senderId: string;
    receiverId: string;

    constructor(messageText: string, senderId: string, receiverId: string){
        this.messageText = messageText;
        this.senderId = senderId;
        this.receiverId = receiverId;
    }
}