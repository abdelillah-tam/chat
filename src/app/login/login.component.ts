import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from "@angular/material/divider";
import * as jose from 'jose';
import { User } from '../model/user';
import { animate, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { emptyStateAction, loginAction, signupAction } from '../state/auth/auth.actions';
import { AuthState } from '../state/auth/auth-state';
import { selectState } from '../state/auth/auth.selectors';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatLabel, MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GoogleUser } from '../model/google-user.interface';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule, MatButtonModule, MatIconModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatLabel, MatInput],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('appear', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms')])
    ])
  ]
})
export class LoginComponent implements OnInit {

  public googleToken = environment.GOOGLE_TOKEN;

  constructor(private authService: AuthService,
    private router: Router,
    private store: Store<AuthState>) {
    if (sessionStorage.getItem('credential') !== null) {
      this.handleCredential(sessionStorage.getItem('credential')!);
      sessionStorage.removeItem('credential');
    }

  }

  changed = 0;

  ngOnInit(): void {
    this.store.select(selectState).subscribe((state) => {
      if (state.state === 'failed') { }
      else if (state.state === 'success' && typeof state.userData !== undefined) {
        let data = state.userData as { email: string; userToken: string; objectId: string };
        this.saveDataLocally(data.email, data.userToken, data.objectId);
        this.store.dispatch(emptyStateAction());
      }
    });

  }

  isPasswordVisible = false;

  isEmailValid = true;
  isPasswordValid = true;

  loginGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  onSubmitLogin() {
    if (this.loginGroup.valid) {
      this.isEmailValid = this.loginGroup.valid;
      this.isPasswordValid = this.loginGroup.valid;
      this.store.dispatch(loginAction({
        email: this.loginGroup.value.email!,
        password: this.loginGroup.value.password!
      }));

    } else {
      this.isEmailValid = this.loginGroup.controls.email.valid;
      this.isPasswordValid = this.loginGroup.controls.password.valid;
    }
  }

  handleCredential(credential: string) {
    let googleUser = jose.decodeJwt<GoogleUser>(credential);

    this.authService.findUserByEmail(googleUser.email, (user) => {
      if (typeof user !== "undefined") {
        if (user.provider === 'backendless') {
          alert('Try to login using email !');
        } else if (user!.provider === 'google') {
          this.store.dispatch(loginAction({ email: googleUser.email!, password: googleUser.sub! }));
        }
      } else {
        this.store.dispatch(signupAction({
          user: new User(googleUser.given_name, googleUser.family_name, googleUser.email, '', '', 'google'),
          password: googleUser!.sub!,
          provider: 'google'
        }));

      }
    })
  }

  makePasswordVisible() {
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

  change() {
    if (this.changed < 2) {
      this.changed += 1;
    } else {
      this.changed = 0;
    }
  }
}
