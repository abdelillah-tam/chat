import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { Message } from '../model/message';
import { from } from 'rxjs';
import {
  getDownloadURL,
  getStorage,
  ref as stRef,
  uploadBytes,
} from 'firebase/storage';
import { Store } from '@ngrx/store';
import { receiveMessageAction } from '../state/messaging/messaging.actions';

export class MessagingService {
  private db = getDatabase();

  constructor(private store: Store) {}

  sendMessage(message: Message) {
    const receiverMessageListRef = ref(
      this.db,
      'chats/' +
        message.senderId +
        '/' +
        message.receiverId +
        '/' +
        message.timestamp
    );
    const senderMessageListRef = ref(
      this.db,
      'chats/' +
        message.receiverId +
        '/' +
        message.senderId +
        '/' +
        message.timestamp
    );

    from(
      set(receiverMessageListRef, {
        messageText: message.messageText,
        senderId: message.senderId,
        receiverId: message.receiverId,
        timestamp: message.timestamp,
        type: message.type,
        imageUrl: message.imageUrl,
      })
    );
    return from(
      set(senderMessageListRef, {
        messageText: message.messageText,
        senderId: message.senderId,
        receiverId: message.receiverId,
        timestamp: message.timestamp,
        type: message.type,
        imageUrl: message.imageUrl,
      })
    );
  }

  listenForMessages(objectId: string) {
    const reference = ref(
      this.db,
      'chats/' + localStorage.getItem('objectId')! + '/' + objectId
    );

    let msgs: any[] = [];

    onValue(reference, (snapshot) => {
      msgs = [];
      snapshot.forEach((child) => {
        msgs.push(child.val());
      });

      this.store.dispatch(receiveMessageAction({ messages: msgs }));
    });

  }

  async getUsers() {
    const reference = ref(
      this.db,
      'chats/' + localStorage.getItem('objectId')!
    );

    let data = await get(reference);

    let ids: string[] = [];
    
    data.forEach((child) => {
      ids.push(child.key);
    });

    return ids;
  }

  async uploadImageMsg(file: File, sender: string) {
    const storage = getStorage();
    let downloadUrl: string;

    const storageRef = stRef(storage, `chats/${sender}/${file.name}`);
    await uploadBytes(storageRef, file);
    let url = await getDownloadURL(storageRef);
    downloadUrl = url;

    return downloadUrl;
  }
}

export class MockMessagingService {
  getUsers() {}
}
