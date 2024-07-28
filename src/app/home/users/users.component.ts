import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../model/user';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessagingService } from '../../services/messaging.service';



@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor(private authService: AuthService, private messagingService: MessagingService){}

  searchInput : string = '';

  users: Array<User> = [];


  findUsers(){
    let userToken = localStorage.getItem('userToken');
    this.authService.findUsers(this.searchInput, userToken!, (users: Array<User>) => {
      this.users = users;
    });
  }

  openChatWindow(objectId: string){
    this.messagingService.openChatWindow(objectId);
  }
}
