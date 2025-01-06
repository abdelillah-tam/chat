import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../../model/message';
import { User } from '../../model/user';
import { Store } from '@ngrx/store';
import {
  emptyImageMsgAction,
  listenForMessagesAction,
  sendMessageAction,
  uploadImageMsgAction,
} from '../../state/messaging/messaging.actions';
import {
  selectImageMsgUrl,
  selectMessages,
} from '../../state/messaging/messaging.selectors';
import { getUserByObjectIdAction } from '../../state/auth/auth.actions';
import {
  selectCurrentLoggedInUser,
  selectUser,
} from '../../state/auth/auth.selectors';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];

  message: Message | null = null;

  senderUser: User | undefined;

  receiverUser: User | undefined;

  text = '';

  file: File | null = null;

  imageUrl: string = '';

  constructor(private store: Store, private router: Router) {}
  ngOnInit(): void {
    this.store.select(selectMessages).subscribe((result) => {
      this.messages = result;
    });

    this.store.select(selectCurrentLoggedInUser).subscribe((result) => {
      this.senderUser = result;
    });

    this.store.select(selectUser).subscribe((result) => {
      this.receiverUser = result;
    });

    this.store.select(selectImageMsgUrl).subscribe((result) => {
      if (result.length > 0) {
        this.message!.imageUrl = result;
        this.store.dispatch(sendMessageAction({ message: this.message! }));
        this.store.dispatch(emptyImageMsgAction());
      }
    });
  }

  sendMessage() {
    if (this.text !== '' && this.file !== null) {
      this.message = {
        messageText: this.text,
        senderId: localStorage.getItem('objectId')!,
        receiverId: this.receiverUser!.objectId,
        timestamp: Date.now().toString(),
        type: 'image and text',
        imageUrl: '',
      };

      this.store.dispatch(
        uploadImageMsgAction({
          file: this.file!,
          sender: this.message.senderId,
        })
      );

      this.text = '';
      this.file = null;
      this.imageUrl = '';
    } else if (this.text !== '' && this.file === null) {
      this.message = {
        messageText: this.text,
        senderId: localStorage.getItem('objectId')!,
        receiverId: this.receiverUser!.objectId,
        timestamp: Date.now().toString(),
        type: 'text',
        imageUrl: '',
      };

      this.store.dispatch(sendMessageAction({ message: this.message }));
      this.text = '';
    } else if (this.text === '' && this.file !== null) {
      this.message = {
        messageText: '',
        senderId: localStorage.getItem('objectId')!,
        receiverId: this.receiverUser!.objectId,
        timestamp: Date.now().toString(),
        type: 'image',
        imageUrl: '',
      };

      this.store.dispatch(
        uploadImageMsgAction({
          file: this.file!,
          sender: this.message.senderId,
        })
      );
      this.text = '';
      this.file = null;
      this.imageUrl = '';
    }
  }

  getCurrentObjectId() {
    return localStorage.getItem('objectId');
  }

  onImageAdded(e: any) {
    this.file = e.target.files[0];
    this.showImage();
  }

  showImage() {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.file!);
    fileReader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
  }

  removeImage() {
    this.file = null;
    this.imageUrl = '';
  }

  @Input()
  set objectId(objectId: string) {
    this.store.dispatch(listenForMessagesAction({ objectId: objectId }));
    this.store.dispatch(getUserByObjectIdAction({ objectId: objectId }));
  }

  closeChat() {
    this.router.navigate(['/']);
  }

  profileImageSetter(index: number) {
    if (this.messages[index].senderId === this.senderUser?.objectId) {
      return this.senderUser.profileImageLink;
    } else if (this.messages[index].senderId === this.receiverUser?.objectId) {
      return this.receiverUser.profileImageLink;
    } else {
      return './assets/user.png';
    }
  }
}
