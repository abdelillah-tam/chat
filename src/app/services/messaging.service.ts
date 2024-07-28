import { EventEmitter, Injectable } from '@angular/core';
import { getDatabase, ref, onValue, set, push, onChildAdded, get, child, query, orderByChild } from "firebase/database";
import { Message } from '../model/message';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  openChat = new EventEmitter<boolean>();

  receiverObjectId = '';

  private db = getDatabase();

  constructor() { }

  openChatWindow(receiverObjectId: string) {
    this.receiverObjectId = receiverObjectId;
    this.openChat.emit(true);
  }

  closeChatWindow() {
    this.openChat.emit(false);
  }

  sendMessage(message: Message) {

    const timestamp = Date.now();

    const receiverMessageListRef = ref(this.db, 'chats/' + message.senderId + '/' + message.receiverId + '/' + timestamp);
    const senderMessageListRef = ref(this.db, 'chats/' + message.receiverId + '/' + message.senderId + '/' + timestamp);

    set(receiverMessageListRef, {
      'messageText': message.messageText,
      'senderId': message.senderId,
      'receiverId': message.receiverId
    });
    set(senderMessageListRef, {
      'messageText': message.messageText,
      'senderId': message.senderId,
      'receiverId': message.receiverId
    });
  }

  listenForMessages(onMessagesDownloaded : (messages: any[]) => void) {
    const reference = ref(this.db, 'chats/' + localStorage.getItem('objectId')! + '/' + this.receiverObjectId);
    
    let msgs: any[] = [];

    onValue(reference, (snapshot) => {
      snapshot.forEach((child) => {
        msgs.push(child.val());
      });

      onMessagesDownloaded(msgs);
    });
  }

  
}
