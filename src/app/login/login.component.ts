import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from "@angular/material/divider";
import * as jose from 'jose';
import { User } from '../model/user';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule, MatDividerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: '205706621989-pken44sei0ti29vd95ukk3o2ja4e4gh1.apps.googleusercontent.com',
      callback: this.handleCredential.bind(this)
    });
  }

  isPasswordVisible = false;

  isEmailValid = true;
  isPasswordValid = true;

  loginGroup = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  onSubmitLogin() {
    if (this.loginGroup.valid) {
      this.isEmailValid = this.loginGroup.valid;
      this.isPasswordValid = this.loginGroup.valid;

      this.authService.login(
        this.loginGroup.value.email!,
        this.loginGroup.value.password!,
        (email, userToken, objectId) => this.saveDataLocally(email, userToken, objectId));
    }else{
      this.isEmailValid = this.loginGroup.controls.email.valid;
      this.isPasswordValid = this.loginGroup.controls.password.valid;
    }
  }

  login() {
    // @ts-ignore
    google.accounts.id.prompt();
  }

  handleCredential(result: { credential: string }) {
    let googleUser = jose.decodeJwt(result.credential);

    // @ts-ignore
    this.authService.findUserByEmail(googleUser.email, (user) => {
      if (typeof user !== "undefined") {
        if (user.provider === 'backendless') {
          alert('Try to login using email !');
        } else if (user!.provider === 'google') {
          this.authService.login(
            // @ts-ignore
            googleUser.email!, googleUser.sub!,
            (email, userToken, objectId) => this.saveDataLocally(email, userToken, objectId))
        }
      } else {

        this.authService.signUp(
          // @ts-ignore 
          new User(googleUser.given_name, googleUser.family_name, googleUser.email, '', '', 'google'),
          googleUser.sub!, 'google', () => {
            this.authService.login(
              // @ts-ignore
              googleUser!.email!,
              googleUser.sub!,
              (email, userToken, objectId) => this.saveDataLocally(email, userToken, objectId))
          }
        )
      }
    })
  }

  makePasswordVisible(){
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  private saveDataLocally(email: string, userToken: string, objectId: string) {
    localStorage.setItem('email', email);
    localStorage.setItem('userToken', userToken);
    localStorage.setItem('objectId', objectId);

    if (localStorage.getItem('email') !== null &&
      localStorage.getItem('userToken') !== null &&
      localStorage.getItem('objectId') !== null) {
      this.router.navigate(['/home']);
    }
  }
}
