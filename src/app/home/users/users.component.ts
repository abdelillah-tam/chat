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

  openChatWindow(objectId: string, index: number){
    this.messagingService.closeChatWindow();
    this.messagingService.openChatWindow(objectId);
    let usersList = document.querySelectorAll('.users-list');
    usersList.forEach((value, key) => {
      let name = value.querySelector('.name-class');

      if(key !== index){
        value.classList.remove('bg-green-600');
        name?.classList.remove('text-white');
        name?.classList.add('text-gray-700');
        
      }else{
        value.classList.add('bg-green-600');
        value.classList.add('text-gray-600');
        name?.classList.add('text-white');
        name?.classList.remove('text-gray-700');
      }
    })
    //usersList[index].classList.add('bg-green-600');
  }
}
