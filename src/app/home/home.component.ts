import { Component, OnInit } from '@angular/core';
import { ContactInformationComponent } from './chat/contact-information/contact-information.component';
import { UsersComponent } from "./users/users.component";
import { ChatComponent } from "./chat/chat.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessagingService } from '../services/messaging.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ContactInformationComponent, UsersComponent, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  opened: boolean = false;
  constructor(private router: Router, private messagingService: MessagingService){}


  ngOnInit(): void {
    if (localStorage.getItem('email') === null ||
            localStorage.getItem('userToken') === null ||
            localStorage.getItem('objectId') === null) {
            this.router.navigate(['/login']);
          }

    this.messagingService.openChat.subscribe((result) => {
      this.opened = result;
    }) 
  }

}
