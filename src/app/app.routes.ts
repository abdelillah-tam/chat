import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './home/users/users.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    {
        title: 'Home',
        path: 'home',
        component: HomeComponent,
        children: [
            {
                path: 'chat',
                component: UsersComponent,

            },
            {
                path: '',
                redirectTo: 'chat',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        title: 'Login',
        path: 'login',
        component: LoginComponent,
        data: { animation: 'Login' }
    },
    {
        title: 'Signup',
        path: 'signup', component: SignupComponent,
        data: { animation: 'Signup' }
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];
