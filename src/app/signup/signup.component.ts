import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { User } from '../model/user';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { emptyStateAction, signupAction } from '../state/auth/auth.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { getCurrentUser } from '../model/get-current-user';
import { saveDataLocally } from '../model/save-user-locally';
import { selectCurrentLoggedInUser } from '../state/auth/auth.selectors';
import { Subscription } from 'rxjs';
import { selectLoginState } from '../state/login/login.selector';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  animations: [
    trigger('ani', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms')]),
      transition(':leave', [style({ opacity: 1 }), animate('5000ms')]),
    ]),
  ],
})
export class SignupComponent implements OnInit, OnDestroy {
  constructor(private store: Store, private router: Router) {}

  signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  selectCurrentLoggedInUser: Subscription | undefined;

  selectLoginState: Subscription | undefined;

  ngOnInit(): void {
    this.signUpForm.addValidators([
      this.comparePasswordValidator('password', 'confirmPassword'),
    ]);

    if (
      localStorage.getItem('objectId') &&
      localStorage.getItem('email') &&
      localStorage.getItem('userToken')
    ) {
      getCurrentUser(this.store);
    }

    this.selectCurrentLoggedInUser = this.store
      .select(selectCurrentLoggedInUser)
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['/']);
        }
      });

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
  }

  ngOnDestroy(): void {
    this.selectCurrentLoggedInUser?.unsubscribe();
    this.selectLoginState?.unsubscribe();
  }

  show = true;

  onSubmit() {
    if (this.signUpForm.valid) {
      this.store.dispatch(
        signupAction({
          user: {
            firstName: this.signUpForm.value.firstName!,
            lastName: this.signUpForm.value.lastName!,
            email: this.signUpForm.value.email!,
            sex: this.signUpForm.value.sex!,
            id: '',
            provider: 'user',
            profilePictureLink: '',
          },
          password: this.signUpForm.value.password!,
          confirmationPassword: this.signUpForm.value.confirmPassword!,
        })
      );
    }
  }

  comparePasswordValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Password do not match' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    };
  }
}
