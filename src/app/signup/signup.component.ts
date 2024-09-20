import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../model/user';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { signupAction } from '../state/auth/auth.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  animations: [
    trigger('ani', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms')]),
      transition(':leave', [style({ opacity: 1 }), animate('5000ms')]),
    ])

  ]
})
export class SignupComponent implements OnInit {

  constructor(private store: Store) {

  }

  signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });
  ngOnInit(): void {

    this.signUpForm.addValidators([this.comparePasswordValidator('password', 'confirmPassword')]);
  }

  show = true;


  onSubmit() {
    if (this.signUpForm.valid) {
      this.store.dispatch(signupAction({
        user: new User(
          this.signUpForm.value.firstName!,
          this.signUpForm.value.lastName!,
          this.signUpForm.value.email!,
          this.signUpForm.value.sex!,
          '',
          ''
        ),
        password: this.signUpForm.value.password!,
        provider: 'backendless'
      }))

    }
  }
  comparePasswordValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Password do not match' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null
      }
    }
  }

}
