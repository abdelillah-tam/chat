import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessagingService } from '../../services/messaging.service';
import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';



@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  animations: [
    trigger('opc', [
      transition(':enter',[
        style({opacity: 0}),
        animate('10s', style({opacity: 1}))
      ])
      
    ]),
    trigger('animateListOfUsers', [
      transition('* => *', [
        query('li', stagger(300, animateChild()))
      ])
    ]),
    trigger('aniOne', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.6s', style({ transform: 'translateX(0)' }))
      ])
    ]),
    
  ]
})
export class UsersComponent implements OnInit {

  constructor(private authService: AuthService, private messagingService: MessagingService) { }

  searchInput: string = '';

  users: Array<User> = [];

  p: Array<User> = [new User('Abdelillah', 'Tamoussat', '', '', '', ''),
  new User('Abdelillah', 'Tamoussat', '', '', '', ''),
  new User('Abdelillah', 'Tamoussat', '', '', '', '')];
  ngOnInit(): void {
    this.messagingService.getUsers();
    this.messagingService.usersYouTalkedWith.subscribe((result) => {
      result.forEach((objectId) => {
        this.authService.findUsersByObjectId(objectId, (user) => {
          this.users.push(user);
          this.openChatWindow(this.users[0].objectId, 0);
        });
      });

    });

  }

  findUsers() {
    if (this.searchInput.length !== 0) {
      let userToken = localStorage.getItem('userToken');
      this.authService.findUsersByName(this.searchInput, userToken!, (users: Array<User>) => {
        this.users = users;
      });
    } else {
      this.messagingService.getUsers();
    }
  }

  openChatWindow(objectId: string, index: number) {
    this.messagingService.closeChatWindow();
    this.messagingService.openChatWindow(objectId);
    let usersList = document.querySelectorAll('.users-list');
    usersList.forEach((value, key) => {
      let name = value.querySelector('.name-class');

      if (key !== index) {
        value.classList.remove('bg-green-600');
        name?.classList.remove('text-white');
        name?.classList.add('text-gray-700');

      } else {
        value.classList.add('bg-green-600');
        value.classList.add('text-gray-600');
        name?.classList.add('text-white');
        name?.classList.remove('text-gray-700');
      }
    })
  }
}
