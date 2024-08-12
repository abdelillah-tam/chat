import { EventEmitter, Injectable } from '@angular/core';
import { getDatabase, ref, onValue, set, push, onChildAdded, get, child, query, orderByChild } from "firebase/database";
import { Message } from '../model/message';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  openChat = new EventEmitter<boolean>();

  usersYouTalkedWith = new EventEmitter<string[]>();

  receiverObjectId = '';

  private db = getDatabase();

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
    
    let msgs: any[] = [];

    onValue(reference, (snapshot) => {
      msgs = [];
      snapshot.forEach((child) => {
        msgs.push(child.val());
      });
      onMessagesDownloaded(msgs);
    });
  }

  getUsers(){
    const reference = ref(this.db, 'chats/' + localStorage.getItem('objectId')!);
    get(reference).then((result) => {
      let users : string[] = [];
      result.forEach((child) => {
        users.push(child.key);
      });

      this.usersYouTalkedWith.emit(users);
      
    })
  }
  
}
