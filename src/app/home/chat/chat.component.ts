import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { FormsModule } from '@angular/forms';
import { Message } from '../../model/message';
import { User } from '../../model/user';
import { Store } from '@ngrx/store';
import { listenForMessagesAction, sendMessageAction } from '../../state/messaging/messaging.actions';
import { selectChat, selectMessages } from '../../state/messaging/messaging.selectors';
import { getUserByObjectIdAction } from '../../state/auth/auth.actions';
import { selectCurrentLoggedInUser, selectUser } from '../../state/auth/auth.selectors';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {

  messages: Message[] = [];

  senderUser: User | undefined;
  receiverUser: User | undefined;

  text = '';

  constructor(private store: Store) {

  }
  ngOnInit(): void {
    this.store.select(selectMessages).subscribe((result) => {
      this.messages = result;
    });

    this.store.select(selectCurrentLoggedInUser).subscribe(result => {
      this.senderUser = result;
    })

    this.store.select(selectUser).subscribe(result => {
      this.receiverUser = result;
    })

    this.store.select(selectChat).subscribe(result => {
      if (result.openChat) {
        this.store.dispatch(listenForMessagesAction({ objectId: result.objectId }));
        this.store.dispatch(getUserByObjectIdAction({ objectId: result.objectId }));
      }
    })
  }


  sendMessage() {
    if (this.text !== '') {
      const message = new Message(this.text,
        localStorage.getItem('objectId')!,
        this.receiverUser!.objectId, Date.now().toString());

      this.text = '';
      console.log(message);
      this.store.dispatch(sendMessageAction({ message: message }));
    }
  }


  getCurrentObjectId() {
    return localStorage.getItem('objectId');
  }
}
