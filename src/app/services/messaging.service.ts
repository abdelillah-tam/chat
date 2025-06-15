import { Message } from '../model/message';
import { from } from 'rxjs';
import { Store } from '@ngrx/store';
import { newMessageAction } from '../state/messaging/messaging.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Echo from 'laravel-echo';

export class MessagingService {
  echo: Echo<'reverb'>;
  channels: { [key: string]: any } = {};

  constructor(private store: Store, private httpClient: HttpClient) {
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: 'la1tngxd6dhbtrugv9ay',
      wsHost: window.location.hostname,
      wsPort: 8080,
      wssPort: 8080,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: 'http://localhost:8000/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      },
    });
  }

  sendMessage(message: FormData) {
    this.httpClient.post(`${environment.API}/send`, message).subscribe();
  }
  listenForMessages(channel: string) {
    if (!this.channels[channel]) {
      this.channels[channel] = this.echo.private(`channel.${channel}`);
      this.channels[channel].listen('.chat', (data: Message) => {
        this.store.dispatch(newMessageAction({ message: data }));
      });
    }
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

  async uploadImageMsg(file: File, sender: string) {
    /*const storage = getStorage();
    let downloadUrl: string;

    const storageRef = stRef(storage, `chats/${sender}/${file.name}`);
    await uploadBytes(storageRef, file);
    let url = await getDownloadURL(storageRef);
    downloadUrl = url;*/

    return 'downloadUrl';
  }
}

export class MockMessagingService {
  getUsers() {}
}
