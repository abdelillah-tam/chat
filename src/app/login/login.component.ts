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
  signupAction,
} from '../state/auth/auth.actions';
import { AuthState } from '../state/auth/auth-state';
import {
  selectCurrentLoggedInUser,
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

  selectCurrentUserLoggedInUser: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AuthState>
  ) {
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

    this.store.select(selectLoginState).subscribe((state) => {
      if (state.state === 'failed') {
      } else if (state.state === 'success') {
        let data = state;
        this.saveDataLocally(data.email, data.userToken, data.objectId);
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
  }

  ngOnDestroy(): void {
    this.selectCurrentUserLoggedInUser?.unsubscribe();
  }

  isPasswordVisible = false;

  isEmailValid = true;
  isPasswordValid = true;

  loginGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmitLogin() {
    if (this.loginGroup.valid) {
      this.isEmailValid = this.loginGroup.valid;
      this.isPasswordValid = this.loginGroup.valid;
      this.store.dispatch(
        loginAction({
          email: this.loginGroup.value.email!,
          password: this.loginGroup.value.password!,
        })
      );
    } else {
      this.isEmailValid = this.loginGroup.controls.email.valid;
      this.isPasswordValid = this.loginGroup.controls.password.valid;
    }
  }

  handleCredential(credential: string) {
    let googleUser = jose.decodeJwt<GoogleUser>(credential);

    this.authService.findUserByEmail(googleUser.email).subscribe((data) => {
      if ('email' in data) {
        if (data.provider === 'backendless') {
          alert('Try to login using email !');
        } else if (data!.provider === 'google') {
          this.store.dispatch(
            loginAction({ email: googleUser.email!, password: googleUser.sub! })
          );
        }
      } else {
        this.store.dispatch(
          signupAction({
            user: {
              firstName: googleUser.given_name,
              lastName: googleUser.family_name,
              email: googleUser.email,
              sex: '',
              id: '',
              provider: 'google',
              profilePictureLink: ''
            },
            password: googleUser!.sub!,
            provider: 'google',
          })
        );
      }
    });
  }

  makePasswordVisible() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  private saveDataLocally(email: string, userToken: string, objectId: string) {
    localStorage.setItem('email', email);
    localStorage.setItem('userToken', userToken);
    localStorage.setItem('objectId', objectId);

    if (
      localStorage.getItem('email') &&
      localStorage.getItem('userToken') &&
      localStorage.getItem('objectId')
    ) {
      this.router.navigate(['/']);
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
