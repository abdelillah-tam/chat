import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {title:'Home', path: 'home', component: HomeComponent},
    {title: 'Login', path: 'login', component: LoginComponent},
    {title: 'Signup', path: 'signup', component: SignupComponent},
    {path:'', redirectTo: '/home', pathMatch:'full'}
];
