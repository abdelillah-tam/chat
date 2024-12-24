import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessagingService } from '../../services/messaging.service';
import { Store } from '@ngrx/store';
import { findUsersAction } from '../../state/auth/auth.actions';
import { selectUsers } from '../../state/auth/auth.selectors';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { openSidenavAction } from '../../state/app/app.actions';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterOutlet,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  searchInput: string = '';

  users: Array<User> = [];

  selectedUserIndex: number = -1;

  closedChat: boolean = true;

  closedSidenav = true;

  constructor(
    private messagingService: MessagingService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.select(selectUsers).subscribe((result) => {
      if (result && result.length) {
        this.users = result;
        let currentUser = this.router.url.slice(6);

        this.selectedUserIndex = this.users.findIndex((user) => {
          return user.objectId === currentUser;
        });
        if (this.router.url !== '/') {
          this.closedChat = false;
        }
      }
    });

    this.messagingService.getUsers();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((result) => {
        if (result.url.startsWith('/chat')) {
          this.closedChat = false;
        } else {
          this.closedChat = true;
        }
      });

  }

  findUsers() {
    if (this.searchInput.length !== 0) {
      this.store.dispatch(findUsersAction({ name: this.searchInput }));
    } else {
      setTimeout(() => {
        this.messagingService.getUsers();
      }, 50);
    }
  }

  openChatWindow(objectId: string, index: number) {
    this.closedChat = false;
    this.selectedUserIndex = index;
    this.router.navigate([`chat/${objectId}`]);
  }

  openSidenav() {
    this.store.dispatch(openSidenavAction());
  }
}
