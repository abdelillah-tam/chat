import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../model/user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import {
  checkIfTokenIsValidAction,
  findUsersAction,
  getAllUsersInContactAction,
} from '../state/auth/auth.actions';
import {
  selectFoundUsers,
  selectTokenValidation,
} from '../state/auth/auth.selectors';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { openSidenavAction } from '../state/app/app.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatProgressSpinnerModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit, OnDestroy {
  searchInput: string = '';

  users: Array<User> = [];

  selectedUserIndex: number = -1;

  closedChat: boolean = true;

  closedSidenav = true;

  selectToken: Subscription | undefined;

  loading = true;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    if (
      !localStorage.getItem('email') ||
      !localStorage.getItem('userToken') ||
      !localStorage.getItem('objectId')
    ) {
      this.router.navigate(['/login']);
    } else {
      this.store.dispatch(
        checkIfTokenIsValidAction({ token: localStorage.getItem('userToken')! })
      );
      this.selectToken = this.store
        .select(selectTokenValidation)
        .subscribe((valid) => {
          if (valid !== undefined) {
            if (!valid) {
              this.router.navigate(['/login']);
            }
          }
        });
    }
    this.store.select(selectFoundUsers).subscribe((result) => {
      if (result && result.length) {
        this.users = result;
        let currentUser = this.router.url.slice(6);

        this.selectedUserIndex = this.users.findIndex((user) => {
          return user.objectId === currentUser;
        });
        if (this.router.url !== '/') {
          this.closedChat = false;
        }
        this.loading = false;
      }
    });

    this.store.dispatch(getAllUsersInContactAction());

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

  ngOnDestroy(): void {
    this.selectToken?.unsubscribe();
  }

  findUsers() {
    if (this.searchInput.length !== 0) {
      this.loading = true;
      this.store.dispatch(findUsersAction({ name: this.searchInput }));
    } else {
      setTimeout(() => {
        this.loading = true;
        this.store.dispatch(getAllUsersInContactAction());
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
