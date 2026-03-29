import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Store } from '@ngrx/store';
import {
  emptyStateAction,
  requestCsrfTokenAction,
  signupAction,
} from '../state/auth/auth.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { getCurrentUser } from '../model/get-current-user';
import { saveDataLocally } from '../model/save-user-locally';
import { Subscription } from 'rxjs';
import { selectLoginState } from '../state/login/login.selector';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LogoComponent } from '../logo/logo.component';
import { comparePasswordValidator } from '../model/passwordValidator';

@Component({
  selector: 'app-signup',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    LogoComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.store.dispatch(requestCsrfTokenAction());
  }

  signUpFormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    new_password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    password_confirmation: new FormControl('', [Validators.required]),
  });

  selectCurrentLoggedInUser: Subscription | undefined;

  selectLoginState: Subscription | undefined;

  ngOnInit(): void {
    this.signUpFormGroup.addValidators([comparePasswordValidator]);
    
    if (
      localStorage.getItem('id') &&
      localStorage.getItem('email')
    ) {
      getCurrentUser(this.store);
    }

    this.selectLoginState = this.store
      .select(selectLoginState)
      .subscribe((state) => {
        if (state.email && state.id && state.state === 'success') {
          saveDataLocally(state.email, state.id);
          this.store.dispatch(emptyStateAction());
          this.router.navigate(['/']);
        }
      });
  }

  ngOnDestroy(): void {
    this.selectCurrentLoggedInUser?.unsubscribe();
    this.selectLoginState?.unsubscribe();
  }

  show = true;

  onSubmit() {
    if (this.signUpFormGroup.valid) {
      this.signUpFormGroup.disable();

      this.store.dispatch(
        signupAction({
          user: {
            firstName: this.signUpFormGroup.value.firstName!,
            lastName: this.signUpFormGroup.value.lastName!,
            email: this.signUpFormGroup.value.email!,
            id: '',
            provider: 'user',
            profilePictureLink: '',
          },
          password: this.signUpFormGroup.value.new_password!,
          passwordConfirmation:
            this.signUpFormGroup.value.password_confirmation!,
        }),
      );
    }
  }

}
