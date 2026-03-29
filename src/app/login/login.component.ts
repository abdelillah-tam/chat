import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatDividerModule } from '@angular/material/divider';
import * as jose from 'jose';
import { Store } from '@ngrx/store';
import {
  emptyStateAction,
  requestCsrfTokenAction,
} from '../state/auth/auth.actions';
import { AuthState } from '../state/auth/auth-state';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GoogleUser } from '../model/google-user.interface';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { selectLoginState } from '../state/login/login.selector';
import { loginAction } from '../state/login/login.actions';
import { saveDataLocally } from '../model/save-user-locally';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LogoComponent } from '../logo/logo.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from '../loading/loading.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    LogoComponent,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline-solid' },
    },
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  selectLoginState: Subscription | undefined;

  selectFoundUserByEmail: Subscription | undefined;

  googleUser: (GoogleUser & jose.JWTPayload) | undefined;

  loading: boolean = false;

  tryEmail: boolean = false;

  snackBar = inject(MatSnackBar);

  matDialog = inject(MatDialog);

  constructor(
    private router: Router,
    private store: Store<AuthState>,
  ) {
    this.store.dispatch(requestCsrfTokenAction());
  }

  changed = 0;

  ngOnInit(): void {
    this.selectLoginState = this.store
      .select(selectLoginState)
      .subscribe((state) => {
        if (state.state === 'success') {
          saveDataLocally(state.email!, state.id!);
          this.showSnack('Login Was Successful', 'success');
          this.store.dispatch(emptyStateAction());
          this.router.navigate(['/']);
        } else if (state.state === 'failed') {
          this.showSnack('Login Failed', 'error');
        }
        this.matDialog.closeAll();
      });
  }

  ngOnDestroy(): void {
    this.selectLoginState?.unsubscribe();
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
      this.matDialog.open(LoadingComponent, {
        width: '400px',
        height: '200px',
        disableClose: true,
      });
      this.store.dispatch(
        loginAction({
          email: this.loginGroup.value.email!,
          password: this.loginGroup.value.password!,
          provider: 'user',
        }),
      );
    }
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

  showSnack(value: string, type: 'success' | 'error') {
    this.snackBar.open(value, '', {
      panelClass: [`snack-${type}`],
      duration: 3000,
    });
  }
}
