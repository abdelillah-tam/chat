import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { FormsModule } from '@angular/forms';
import { Message } from '../../model/message';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  messages: Message[] = [];

  senderUser: User | undefined;
  receiverUser: User | undefined;

  text = "";

  constructor(private messagingService: MessagingService, private authService: AuthService) {
    this.messagingService.listenForMessages((messages) => {
      this.messages = messages;
    });
    
    this.authService.getFullName(localStorage.getItem('objectId')!, (user) => {
      this.senderUser = user;
    });

    this.authService.getFullName(this.messagingService.receiverObjectId, (user) => {
      this.receiverUser = user;
    });
  }


  sendMessage() {
    const message = new Message(this.text,
      localStorage.getItem('objectId')!,
      this.messagingService.receiverObjectId);

    this.messagingService.sendMessage(message);
  }


  getCurrentObjectId(){
    return localStorage.getItem('objectId');
  }
}
