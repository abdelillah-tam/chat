import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule, MatDividerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: '205706621989-pken44sei0ti29vd95ukk3o2ja4e4gh1.apps.googleusercontent.com',
      callback: this.handleCredential.bind(this)
    });
  }

  ngOnInit(): void {


  }


  loginGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.minLength(8)])
    }
  );

  onSubmitLogin() {
    if (this.loginGroup.valid) {
      this.authService.login(
        this.loginGroup.value.email!,
        this.loginGroup.value.password!,
        (email, userToken, objectId) => {
          localStorage.setItem('email', email);
          localStorage.setItem('userToken', userToken);
          localStorage.setItem('objectId', objectId);

          if (localStorage.getItem('email') !== null &&
            localStorage.getItem('userToken') !== null &&
            localStorage.getItem('objectId') !== null) {
            this.router.navigate(['/home']);
          }
        });
    }
  }

  login() {
    // @ts-ignore
    google.accounts.id.prompt();
  }

  handleCredential(credential: { credential: string }) {
    this.authService.loginWithProvider(credential);
  }
}
