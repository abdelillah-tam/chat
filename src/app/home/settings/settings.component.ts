import { Component, OnInit, output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../model/user';
import { animate, transition, trigger } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {

  currentUser: User | undefined;

  hiddenSettings = output<boolean>();

  constructor(private authService: AuthService) {

  }
  ngOnInit(): void {
    this.authService.findUserByEmail(localStorage.getItem('email')!, (user) => {
      this.currentUser = user;
      this.infoGroup.controls.firstName.setValue(this.currentUser!.firstName);
      this.infoGroup.controls.lastName.setValue(this.currentUser!.lastName);
      this.infoGroup.controls.email.setValue(this.currentUser!.email);

      if (this.currentUser!.provider === 'google') {
        this.infoGroup.controls.email.disable();
        this.infoGroup.controls.password.disable();
      }

    })
  }


  infoGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('')
  });

  updateInfos() {
    if (this.infoGroup.valid && this.currentUser!.provider !== 'google') {
      this.authService.updateInfos(
        localStorage.getItem('objectId')!,
        this.infoGroup.value.firstName!,
        this.infoGroup.value.lastName!,
        this.infoGroup.value.email!,
        this.infoGroup.value.password!.length >= 8 ? this.infoGroup.value.password! : undefined,
        (user) => {
          localStorage.setItem('email', user.email!);
        }
      )


    } else if (this.infoGroup.valid) {
      this.authService.updateInfos(
        localStorage.getItem('objectId')!,
        this.infoGroup.value.firstName!,
        this.infoGroup.value.lastName!,
        undefined,
        undefined,
        (user) => { }
      )
    }
  }

  hideSettings() {
    this.hiddenSettings.emit(true);
  }
}
