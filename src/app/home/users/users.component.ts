import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessagingService } from '../../services/messaging.service';
import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { openChatWindowAction } from '../../state/messaging/messaging.actions';
import { emptyStateAction, getAllUsersInContactAction } from '../../state/auth/auth.actions';
import { selectUsers } from '../../state/auth/auth.selectors';
import { MatListModule } from '@angular/material/list';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatListModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private messagingService: MessagingService,
    private store: Store) {
     }

  searchInput: string = '';

  users: Array<User> = [];

  ngOnInit(): void {

    this.store.select(selectUsers)
      .subscribe(result => {
        if (result !== undefined) {
          this.users = result;
          setTimeout(() => {
            this.openChatWindow(this.users[0].objectId, 0);
          }, 5);

        }
      })

    this.messagingService.getUsers();

  }

  findUsers() {
    if (this.searchInput.length !== 0) {
      this.authService.findUsersByName(this.searchInput, (users: Array<User>) => {
        this.users = users;
      });
    } else {
      setTimeout(() => {
        this.messagingService.getUsers();
      }, 50);

    }
  }

  openChatWindow(objectId: string, index: number) {
    this.store.dispatch(emptyStateAction());
    this.store.dispatch(openChatWindowAction({ objectId: objectId }));

    let usersList = this.elementRef.nativeElement.querySelectorAll('.users-list');
    // @ts-ignore
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
