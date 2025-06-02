import { Component, OnInit } from '@angular/core';
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
import { signupAction } from '../state/auth/auth.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { getCurrentUser } from '../model/get-current-user';
import { selectCurrentLoggedInUser } from '../state/auth/auth.selectors';

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
export class SignupComponent implements OnInit {
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
  ngOnInit(): void {
    this.signUpForm.addValidators([
      this.comparePasswordValidator('password', 'confirmPassword'),
    ]);
    getCurrentUser(this.store);
    this.store.select(selectCurrentLoggedInUser).subscribe((result) => {
      if (result) {
        this.router.navigate(['/']);
      }
    });
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
            provider: '',
            profilePictureLink: ''
          },
          password: this.signUpForm.value.password!,
          provider: 'backendless'
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
