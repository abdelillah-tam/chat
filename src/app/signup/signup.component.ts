import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../model/user';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { loginResultAction, signupAction } from '../state/auth/auth.actions';
import { selectState } from '../state/auth/auth.selectors';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
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

  constructor(private router: Router, private store: Store) {

  }
  ngOnInit(): void {
    this.store.select(selectState).subscribe((result) => {
      this.router.navigate(['/home']);
    });
  }

  show = true;

  isEmailValid = true;
  isPasswordValid = true;

  signUpForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    sex: new FormControl('Sex'),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });


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
    } else {
      this.isEmailValid = this.signUpForm.controls.email.valid;
      this.isPasswordValid = this.signUpForm.controls.password.valid;
    }
  }

}
