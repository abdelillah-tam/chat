import { EventEmitter, Injectable } from '@angular/core';
import { getDatabase, ref, onValue, set, push, onChildAdded, get, child, query, orderByChild } from "firebase/database";
import { Message } from '../model/message';
import { User } from '../model/user';
import { from } from 'rxjs';
import { Store } from '@ngrx/store';
import { receiveMessageAction } from '../state/messaging/messaging.actions';
import { getAllUsersInContactAction } from '../state/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {


  private db = getDatabase();

  constructor(private store: Store) { }

  sendMessage(message: Message) {
    console.log(message);

    const receiverMessageListRef = ref(this.db, 'chats/' + message.senderId + '/' + message.receiverId + '/' + message.timestamp);
    const senderMessageListRef = ref(this.db, 'chats/' + message.receiverId + '/' + message.senderId + '/' + message.timestamp);

    from(set(receiverMessageListRef, {
      'messageText': message.messageText,
      'senderId': message.senderId,
      'receiverId': message.receiverId,
      'timestamp': message.timestamp
    }));
    return from(set(senderMessageListRef, {
      'messageText': message.messageText,
      'senderId': message.senderId,
      'receiverId': message.receiverId,
      'timestamp': message.timestamp
    }));
  }

  listenForMessages(objectId: string) {
    const reference = ref(this.db, 'chats/' + localStorage.getItem('objectId')! + '/' + objectId);

    let msgs: any[] = [];

    onValue(reference, (snapshot) => {
      msgs = [];
      snapshot.forEach((child) => {
        msgs.push(child.val());
      });

      this.store.dispatch(receiveMessageAction({ messages: msgs }));
    });

  }

  getUsers() {
    const reference = ref(this.db, 'chats/' + localStorage.getItem('objectId')!);
    get(reference).then((result) => {
      let users: string[] = [];
      result.forEach((child) => {
        users.push(child.key);
      });
      this.store.dispatch(getAllUsersInContactAction({ objectsId: users }));
    })
  }

}
