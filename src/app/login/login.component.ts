import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import * as jose from 'jose';
import { animate, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import {
  emptyStateAction,
  findUserByEmailAction,
  signupAction,
} from '../state/auth/auth.actions';
import { AuthState } from '../state/auth/auth-state';
import {
  selectCurrentLoggedInUser,
  selectFoundUserByEmail,
} from '../state/auth/auth.selectors';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule, MatLabel, MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GoogleUser } from '../model/google-user.interface';
import { environment } from '../../environments/environment';
import { getCurrentUser } from '../model/get-current-user';
import { Subscription } from 'rxjs';
import { selectLoginState } from '../state/login/login.selector';
import { loginAction } from '../state/login/login.actions';
import { saveDataLocally } from '../model/save-user-locally';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatInput,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('appear', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms')]),
    ]),
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  public googleToken = environment.GOOGLE_TOKEN;

  selectLoginState: Subscription | undefined;

  selectCurrentUserLoggedInUser: Subscription | undefined;

  selectFoundUserByEmail: Subscription | undefined;

  googleUser: (GoogleUser & jose.JWTPayload) | undefined;

  constructor(private router: Router, private store: Store<AuthState>) {
    if (sessionStorage.getItem('credential') !== null) {
      this.handleCredential(sessionStorage.getItem('credential')!);
      sessionStorage.removeItem('credential');
    }
  }

  changed = 0;

  ngOnInit(): void {
    if (
      localStorage.getItem('email') &&
      localStorage.getItem('userToken') &&
      localStorage.getItem('objectId')
    ) {
      getCurrentUser(this.store);
    }

    this.selectLoginState = this.store
      .select(selectLoginState)
      .subscribe((state) => {
        if (
          state.email &&
          state.userToken &&
          state.objectId &&
          state.state === 'success'
        ) {
          saveDataLocally(state.email, state.userToken, state.objectId);
          this.store.dispatch(emptyStateAction());
          getCurrentUser(this.store);
        }
      });

    this.selectCurrentUserLoggedInUser = this.store
      .select(selectCurrentLoggedInUser)
      .subscribe((result) => {
        if (result && 'email' in result) {
          this.router.navigate(['/']);
        }
      });

    this.selectFoundUserByEmail = this.store
      .select(selectFoundUserByEmail)
      .subscribe((data) => {
        if (data) {
          if ('email' in data) {
            if (data.provider === 'user') {
              alert('Try to login using email !');
            } else if (data!.provider === 'google') {
              this.store.dispatch(
                loginAction({
                  email: this.googleUser?.email!,
                  password: '',
                  provider: 'google',
                })
              );
            }
          } else {
            this.store.dispatch(
              signupAction({
                user: {
                  firstName: this.googleUser!.given_name,
                  lastName: this.googleUser!.family_name,
                  email: this.googleUser!.email,
                  sex: '',
                  id: '',
                  provider: 'google',
                  profilePictureLink: '',
                },
                password: undefined,
                confirmationPassword: undefined,
              })
            );
          }

          this.store.dispatch(emptyStateAction());
        }
      });
  }

  ngOnDestroy(): void {
    this.selectLoginState?.unsubscribe();
    this.selectCurrentUserLoggedInUser?.unsubscribe();
    this.selectFoundUserByEmail?.unsubscribe();
  }

  isPasswordVisible = false;

  loginGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmitLogin() {
    if (this.loginGroup.valid) {
      this.store.dispatch(
        loginAction({
          email: this.loginGroup.value.email!,
          password: this.loginGroup.value.password!,
          provider: 'user',
        })
      );
    }
  }

  handleCredential(credential: string) {
    this.googleUser = jose.decodeJwt<GoogleUser>(credential);

    this.store.dispatch(
      findUserByEmailAction({ email: this.googleUser.email })
    );
  }

  makePasswordVisible() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  change() {
    if (this.changed < 2) {
      this.changed += 1;
    } else {
      this.changed = 0;
    }
  }
}
