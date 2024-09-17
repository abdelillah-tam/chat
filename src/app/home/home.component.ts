import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersComponent } from "./users/users.component";
import { ChatComponent } from "./chat/chat.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user';
import { SettingsComponent } from './settings/settings.component';
import { Store } from '@ngrx/store';
import { selectChat } from '../state/messaging/messaging.selectors';
import { checkIfTokenIsValidAction, getCurrentLoggedInUser } from '../state/auth/auth.actions';
import { selectCurrentLoggedInUser, selectTokenValidation } from '../state/auth/auth.selectors';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UsersComponent, ChatComponent, SettingsComponent, MatListModule,MatToolbarModule, MatMenuModule, MatSidenavModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
 
})
export class HomeComponent implements OnInit {

  openSide: boolean = false;

  openedChat: boolean = false;

  openedSettings: boolean = false;

  openedUsersPanelInMobile = false;

  changed = false;

  constructor(private router: Router,
    private authService: AuthService, private store: Store) {

    if (localStorage.getItem('email') === null ||
      localStorage.getItem('userToken') === null ||
      localStorage.getItem('objectId') === null) {
      this.router.navigate(['/login']);
    } else {
      this.store.dispatch(checkIfTokenIsValidAction({ token: localStorage.getItem('userToken')! }));

      this.store.select(selectTokenValidation)
        .subscribe((valid) => {
          if (valid !== undefined && !valid) {
            this.router.navigate(['/login']);
          }
        });
    }
    this.getFullName();
  }

  currentUser: User | undefined;

  ngOnInit(): void {

    this.store.select(selectChat)
      .subscribe(result => {
        this.openedChat = result.openChat;
      });

    this.store.select(selectCurrentLoggedInUser).subscribe(result => {
      this.currentUser = result;
    });
  }


  getFullName() {
    this.store.dispatch(getCurrentLoggedInUser({ objectId: localStorage.getItem('objectId')! }));
  }


  openSettings() {
    this.openedChat = false;
    this.openedSettings = true;
    this.openSide = false;
  }

  closeSettings() {
    this.openedSettings = false;
  }

  logout() {
    localStorage.clear();
    this.authService.logout();
    if (localStorage.length === 0) {
      this.router.navigate(['/login']);
    }

  }

  showMenu() {
    this.openedUsersPanelInMobile = !this.openedUsersPanelInMobile;
  }

  change() {
    this.changed = !this.changed;
  }
}
