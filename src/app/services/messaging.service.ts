import { Message } from '../model/message';
import { Store } from '@ngrx/store';
import { newMessageAction } from '../state/messaging/messaging.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAllUsersInContactAction } from '../state/auth/auth.actions';

export class MessagingService {
  echo: Echo<'pusher'> | undefined;
  channels: { [key: string]: any } = {};

  constructor(private store: Store, private httpClient: HttpClient) {}

  sendMessage(message: FormData, firstMessage: boolean) {
    this.initializeEcho();
    if (firstMessage) {
      this.channels[message.get('channel')!.toString()] = this.echo!.private(
        `channel.${message.get('channel')!.toString()}`
      );
      this.channels[message.get('channel')!.toString()].on(
        'pusher:subscription_succeeded',
        () => {
          this.listenForMessages(message.get('channel')!.toString(), true);
          if (!message.get('image')) {
            this.httpClient
              .post(`${environment.API}/send`, message)
              .subscribe();
          } else {
            this.uploadImageMsg(
              message.get('image')!.valueOf() as File,
              message.get('senderId')!.toString()
            ).then((value) => {
              message.set('image', value);
              this.httpClient
                .post(`${environment.API}/send`, message)
                .subscribe();
            });
          }
        }
      );
    } else {
      if (!message.get('image')) {
        this.httpClient.post(`${environment.API}/send`, message).subscribe();
      } else {
        this.uploadImageMsg(
          message.get('image')!.valueOf() as File,
          message.get('senderId')!.toString()
        ).then((value) => {
          message.set('image', value);
          this.httpClient.post(`${environment.API}/send`, message).subscribe();
        });
      }
    }
  }

  createChannel(channel: string, firstUser: string, secondUser: string) {
    return this.httpClient.post<string>(`${environment.API}/createChannel`, {
      channel: channel,
      firstUser: firstUser,
      secondUser: secondUser,
    }); // if channel already exist it won't create a new one, instead it will return the existing channel
  }

  listenForMessages(channel: string, firstMessage: boolean) {
    this.initializeEcho();
    if (firstMessage) {
      this.channels[channel].listen('.chat', (data: Message) => {
        this.store.dispatch(newMessageAction({ message: data }));
      });
    } else {
      if (!this.channels[channel]) {
        this.channels[channel] = this.echo!.private(`channel.${channel}`);
        this.channels[channel].listen('.chat', (data: Message) => {
          this.store.dispatch(newMessageAction({ message: data }));
        });
      }
    }
  }

  listenForNewChat() {
    this.initializeEcho();
    let chats = this.echo!.private(
      `user.${localStorage.getItem('objectId')!}`
    );

    chats.listen('.chats', () => {
      this.store.dispatch(getAllUsersInContactAction());
    });
  }

  getAllMessages(chatChannel: string) {
    return this.httpClient.get<Message[]>(
      `${environment.API}/getMessages/${chatChannel}`
    );
  }

  getAllChatChannels() {
    return this.httpClient.get<string[]>(`${environment.API}/getAllChannels`);
  }

  getChatChannel(otherUserId: string) {
    return this.httpClient.get<string>(
      `${environment.API}/chatchannel/${otherUserId}`
    );
  }

  private initializeEcho() {
    if (!this.echo) {
      //@ts-ignore
      window.Pusher = Pusher;

      this.echo = new Echo({
        broadcaster: 'pusher',
        cluster: 'eu',
        key: 'f98a33f83ca52a4ae1cd',
        forceTLS: false,
        authEndpoint: environment.AUTH_ENDPOINT,
        auth: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        },
      });
    }
  }

  unsubscribeFromChannels(){
    this.echo?.leaveAllChannels();
  }

  private async uploadImageMsg(file: File, sender: string) {
    const storage = getStorage();
    let downloadUrl: string;

    const storageRef = ref(storage, `chats/${sender}/${file.name}`);
    await uploadBytes(storageRef, file);
    let url = await getDownloadURL(storageRef);
    downloadUrl = url;

    return downloadUrl;
  }

  hasImage(image: File | null, sender: string) {
    if (image) {
      return this.uploadImageMsg(image, sender);
    }

    return false;
  }
}

export class MockMessagingService {
  getUsers() {}
}
