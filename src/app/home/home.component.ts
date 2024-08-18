import { Component, OnInit } from '@angular/core';
import { ContactInformationComponent } from './chat/contact-information/contact-information.component';
import { UsersComponent } from "./users/users.component";
import { ChatComponent } from "./chat/chat.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessagingService } from '../services/messaging.service';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user';
import { SettingsComponent } from './settings/settings.component';
import { trigger, state, style, animate, transition, AnimationEvent, keyframes, query, animateChild, stagger } from '@angular/animations'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContactInformationComponent, UsersComponent, ChatComponent, SettingsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('openUsersPanel', [
      state('opened', style({
        left: '0px'
      })),
      state('closed', style({
        left: '-100%'
      })),
      transition('opened <=> closed', [animate('0.5s')])
    ]),
    trigger('appear', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms', keyframes([
        style({ opacity: 0, offset: 0 }),
        style({ opacity: 1, offset: 1 })
      ]))
      ]),

      transition(':leave', [style({ opacity: 1 }), animate('50ms', style({ opacity: 0 }))]),
    ]),

  ]
})
export class HomeComponent implements OnInit {

  openedChat: boolean = false;

  openedSettings: boolean = false;

  openedPanel: boolean = false;

  openedUsersPanelInMobile = false;

  changed = false;

  constructor(private router: Router,
    private messagingService: MessagingService,
    private authService: AuthService) {
    this.getFullName();
  }

  currentUser: User | undefined;

  ngOnInit(): void {

    if (localStorage.getItem('email') === null ||
      localStorage.getItem('userToken') === null ||
      localStorage.getItem('objectId') === null) {
      this.router.navigate(['/login']);
    } else {
      this.authService.verifyIfTokenValid(localStorage.getItem('userToken')!, (value) => {
        if (!value) {
          this.router.navigate(['/login']);
        }
      })
    }
    this.messagingService.openChat.subscribe((result) => {
      this.openedChat = result;
    })
  }


  getFullName() {
    this
      .authService
      .getFullName(localStorage.getItem('objectId')!, (user) => {
        this.currentUser = user;
      });
  }

  openPanel() {
    this.openedPanel = !this.openedPanel;
  }

  openSettings() {
    this.openedPanel = false;
    this.openedChat = false;
    this.openedSettings = true;
  }

  closeSettings() {
    this.openedSettings = false;
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('email');
    localStorage.removeItem('userToken');
    localStorage.removeItem('objectId');
    this.router.navigate(['/login']);
  }

  showMenu() {
    this.openedUsersPanelInMobile = !this.openedUsersPanelInMobile;
  }

  change() {
    this.changed = !this.changed;
  }
}
