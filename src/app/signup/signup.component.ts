import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../model/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(private authService: AuthService, private router: Router) { }

  signUpForm = new FormGroup({
    firstName: new FormControl('', [Validators.nullValidator]),
    lastName: new FormControl('', [Validators.nullValidator],),
    sex: new FormControl('Sex'),
    email: new FormControl('', [Validators.email, Validators.nullValidator]),
    password: new FormControl('', [Validators.minLength(8)])
  });


  onSubmit() {
    if (this.signUpForm.valid) {
      this.authService.signUp(new User(
        this.signUpForm.value.firstName!,
        this.signUpForm.value.lastName!,
        this.signUpForm.value.email!,
        this.signUpForm.value.sex!,
        ''
      )
        , this.signUpForm.value.password!, () => {
          this.router.navigate(['/login']);
        });
    }
  }

}
