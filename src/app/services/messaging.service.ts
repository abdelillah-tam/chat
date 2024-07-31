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


    const receiverMessageListRef = ref(this.db, 'chats/' + message.senderId + '/' + message.receiverId + '/' + message.timestamp);
    const senderMessageListRef = ref(this.db, 'chats/' + message.receiverId + '/' + message.senderId + '/' + message.timestamp);

    set(receiverMessageListRef, {
      'messageText': message.messageText,
      'senderId': message.senderId,
      'receiverId': message.receiverId,
      'timestamp': message.timestamp
    });
    set(senderMessageListRef, {
      'messageText': message.messageText,
      'senderId': message.senderId,
      'receiverId': message.receiverId,
      'timestamp': message.timestamp
    });
  }

  listenForMessages(onMessagesDownloaded : (messages: any[]) => void) {
    const reference = ref(this.db, 'chats/' + localStorage.getItem('objectId')! + '/' + this.receiverObjectId);
    console.log('listen called');
    let msgs: any[] = [];

    onValue(reference, (snapshot) => {
      msgs = [];
      snapshot.forEach((child) => {
        msgs.push(child.val());
      });
      onMessagesDownloaded(msgs);
    });
  }

  
}
