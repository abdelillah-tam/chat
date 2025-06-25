import { CommonModule } from '@angular/common';
import {
  Component,
  contentChild,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../../model/message';
import { User } from '../../model/user';
import { Store } from '@ngrx/store';
import {
  createChannelAction,
  getAllMessagesAction,
  getChatChannelAction,
  listenForMessagesAction,
  sendMessageAction,
} from '../../state/messaging/messaging.actions';
import {
  selectChatChannel,
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
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipePipe } from '../../date-pipe.pipe';

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
    DatePipePipe,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];

  another: Message[] = [];

  message: Message | null = null;

  senderUser: User | undefined;

  receiverUser: User | undefined;

  channel: string | undefined;

  text = '';

  file: File | null = null;

  inputFile = viewChild<ElementRef<HTMLInputElement>>('inputFile');

  imageUrl: string = '';

  selectSender: Subscription | undefined;

  selectReceiver: Subscription | undefined;

  selectChatChannel: Subscription | undefined;

  selectMessages: Subscription | undefined;

  constructor(private store: Store, private router: Router) {}
  ngOnInit(): void {
    this.selectSender = this.store
      .select(selectCurrentLoggedInUser)
      .subscribe((result) => {
        if (result && 'firstName' in result) {
          this.senderUser = result;
        }
      });

    this.selectReceiver = this.store.select(selectUser).subscribe((result) => {
      if (result && 'firstName' in result) {
        this.receiverUser = result;
      }
    });

    this.selectChatChannel = this.store
      .select(selectChatChannel)
      .subscribe((result) => {
        if (result.chatChannel.length) {
          this.channel = result.chatChannel;
          this.store.dispatch(
            getAllMessagesAction({ channelId: result.chatChannel })
          );
        }
      });

    this.selectMessages = this.store
      .select(selectMessages)
      .subscribe((result) => {
        if (result.length) {
          this.messages = result.filter((item) => {
            return item.channel == this.channel;
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.messages = [];
    this.selectReceiver?.unsubscribe();
    this.selectSender?.unsubscribe();
    this.selectChatChannel?.unsubscribe();
    this.selectMessages?.unsubscribe();
  }

  sendMessage() {
    if (this.file || this.text.length) {
      let message = new FormData();
      let channelUUID = crypto.randomUUID();
      message.append('messageText', this.text ?? '');
      message.append('senderId', localStorage.getItem('objectId')!);
      message.append('receiverId', this.receiverUser!.id);
      message.append('channel', channelUUID);
      if (this.file) {
        message.append('image', this.file);
      }

      if (!this.messages.length) {
        this.channel = channelUUID;
      }

      this.store.dispatch(
        sendMessageAction({
          message: message,
          firstMessage: this.messages.length === 0 ? true : false,
        })
      );
      //this.store.dispatch(createChannelAction({ message: message }));
      this.file = null;
      this.text = '';
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
    this.inputFile()!.nativeElement.value = '';
  }

  @Input()
  set objectId(objectId: string) {
    this.channel = undefined;
    this.messages = [];
    this.store.dispatch(
      getUserByObjectIdAction({
        objectId: objectId,
      })
    );

    this.store.dispatch(getChatChannelAction({ otherUserId: objectId }));
  }

  closeChat() {
    this.router.navigate(['/']);
  }

  profileImageSetter(index: number) {
    if (
      this.messages[index].senderId == this.senderUser?.id &&
      this.senderUser.profilePictureLink
    ) {
      return this.senderUser.profilePictureLink;
    } else if (
      this.messages[index].senderId == this.receiverUser?.id &&
      this.receiverUser.profilePictureLink
    ) {
      return this.receiverUser.profilePictureLink;
    } else {
      return './assets/user.png';
    }
  }

  calculateOneDay(currTimestamp: number, prevTimestamp: number) {
    let currentDate = new Date(currTimestamp * 1000);
    let previousDate = new Date(prevTimestamp * 1000);

    currentDate.setHours(0, 0, 0, 0);
    previousDate.setHours(0, 0, 0, 0);

    return previousDate.getTime() < currentDate.getTime();
  }

  whichDay(currTimestamp: number) {
    let now = new Date(); // Get the current date and time
    now.setHours(0, 0, 0, 0); // Set to the beginning of today

    let timestampDate = new Date(currTimestamp * 1000); // Convert timestamp to Date object
    timestampDate.setHours(0, 0, 0, 0); // Set to the beginning of the timestamp's day

    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day

    // Calculate the difference in days
    // We divide by oneDay and round to handle potential minor time differences
    // that don't affect the day itself.
    const diffDays = Math.round(
      (now.getTime() - timestampDate.getTime()) / oneDay
    );

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      // If it's not today or yesterday, return the original timestamp in milliseconds
      return currTimestamp * 1000;
    }
  }
}
