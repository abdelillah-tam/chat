import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './home/users/users.component';
import { SettingsComponent } from './settings/settings.component';
import { ChatComponent } from './home/users/chat/chat.component';

export const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'chat/:objectId',
        component: ChatComponent,
      },
      {
        path: 'chat',
        redirectTo: '',
      },
    ],
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    title: 'Login',
    path: 'login',
    component: LoginComponent,
    data: { animation: 'Login' },
  },
  {
    title: 'Signup',
    path: 'signup',
    component: SignupComponent,
    data: { animation: 'Signup' },
  }
];
