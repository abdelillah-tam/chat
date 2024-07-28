import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) { }


  loginGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.minLength(8)])
    }
  );

  onSubmitLogin() {
    if (this.loginGroup.valid) {
      this.authService.login(
        this.loginGroup.value.email!,
        this.loginGroup.value.password!,
        (email, userToken, objectId) => {
          localStorage.setItem('email', email);
          localStorage.setItem('userToken', userToken);
          localStorage.setItem('objectId', objectId);

          if (localStorage.getItem('email') !== null &&
            localStorage.getItem('userToken') !== null &&
            localStorage.getItem('objectId') !== null) {
            this.router.navigate(['/home']);
          }
        });
    }
  }


}
