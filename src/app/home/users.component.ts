import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { User } from '../model/user';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import {
  findUsersAction,
  getAllUsersInContactAction,
} from '../state/auth/auth.actions';
import {
  selectCurrentLoggedInUser,
  selectFoundUsers,
} from '../state/auth/auth.selectors';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { debounceTime, filter, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { openSidenavAction } from '../state/app/app.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getCurrentUser } from '../model/get-current-user';
import { isLoggedIn } from '../model/is-logged-in';
import { listenForMessagesAction } from '../state/messaging/messaging.actions';
import { selectLastMessage } from '../state/messaging/messaging.selectors';
import { UserItemComponent } from './user-item/user-item.component';
import { MessagingService } from '../services/messaging.service';
import { BreakpointObserver } from '@angular/cdk/layout';
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
    UserItemComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, OnDestroy {
  breakPointObserver = inject(BreakpointObserver);

  searchFormControl = new FormControl('');

  users: (
    | { user: User; channel: string; lastMessageTimestamp: number }
    | User
  )[] = [];

  selectedUserIndex: number = -1;

  closedChat: boolean = true;

  closedSidenav = true;

  selectCurrentUser: Subscription | undefined;
  selectFoundUsers: Subscription | undefined;
  selectLastMessage: Subscription | undefined;

  loading = true;

  isSmallScreen = false;
  constructor(
    private store: Store,
    private router: Router,
    private messagingService: MessagingService,
  ) {}

  ngOnInit(): void {
    this.breakPointObserver.observe(['(width<40rem)']).subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
    this.messagingService.listenForNewChat();
    if (!isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    this.searchFormControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        if (value?.length) {
          this.store.dispatch(findUsersAction({ name: value }));
        } else {
          this.store.dispatch(getAllUsersInContactAction());
        }
      });

    this.selectFoundUsers = this.store
      .select(selectFoundUsers)
      .subscribe((result) => {
        if (result) {
          this.users = this.sortUsers(result);

          this.users.forEach((item) => {
            if ('lastMessageTimestamp' in item) {
              this.store.dispatch(
                listenForMessagesAction({
                  channelId: item.channel,
                  firstMessage: false,
                }),
              );
            }
          });

          this.selectIndex();

          if (this.router.url !== '/') {
            this.closedChat = false;
          }
          this.loading = false;
        }
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((result) => {
        if (result.url.startsWith('/chat')) {
          this.closedChat = false;
        } else {
          this.closedChat = true;
        }
      });

    this.selectLastMessage = this.store
      .select(selectLastMessage)
      .subscribe((result) => {
        if (result) {
          let itemIndex = this.users.findIndex((user) => {
            if ('channel' in user) {
              return user.channel == result.channel;
            }

            return null;
          });

          const newList = this.users.map((item, index) => {
            return index == itemIndex
              ? { ...item, lastMessageTimestamp: result.timestamp }
              : item;
          });

          this.users = this.sortUsers(newList);

          this.selectIndex();
        }
      });

    this.store.dispatch(getAllUsersInContactAction());
  }

  ngOnDestroy(): void {
    this.selectCurrentUser?.unsubscribe();
    this.selectFoundUsers?.unsubscribe();
    this.selectLastMessage?.unsubscribe();
  }

  findUsers() {}

  openChatWindow(objectId: string, index: number) {
    this.closedChat = false;
    this.selectedUserIndex = index;
    this.router.navigate([`chat/${objectId}`]);
  }

  openSidenav() {
    this.store.dispatch(openSidenavAction());
  }

  trackByFn(user: any) {
    return 'user' in user ? user.user.id : user.id;
  }

  passUser(user: any): User {
    return 'user' in user ? user.user : user;
  }

  private sortUsers(users: any[]) {
    return Array.from(users).sort((a, b) => {
      if ('lastMessageTimestamp' in a && 'lastMessageTimestamp'! in b) {
        return b.lastMessageTimestamp - a.lastMessageTimestamp;
      }
      return 1;
    });
  }

  selectIndex() {
    let currentUserId = this.router.url.slice(6);
    this.selectedUserIndex = this.users.findIndex((userItem) => {
      if ('user' in userItem) {
        return userItem.user.id == currentUserId;
      } else {
        return userItem.id == currentUserId;
      }
    });
  }
}
