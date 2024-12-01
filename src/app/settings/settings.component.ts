import { AfterContentInit, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { Store } from '@ngrx/store';
import {
  selectCurrentLoggedInUser,
  selectState,
} from '../state/auth/auth.selectors';
import {
  updateUserInfoAction,
  uploadProfilePicAction,
} from '../state/auth/auth.actions';
import { getCurrentUser } from '../model/get-current-user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, AfterContentInit {
  currentUser: User | undefined;

  file: File | null = null;

  profileImageUrl: string = '';

  loading: boolean = false;

  constructor(private store: Store, private router: Router) {
    getCurrentUser(this.store);
  }

  ngAfterContentInit(): void {
    this.store.select(selectCurrentLoggedInUser).subscribe((result) => {
      this.currentUser = result;
      this.infoGroup.controls.firstName.setValue(this.currentUser!.firstName);
      this.infoGroup.controls.lastName.setValue(this.currentUser!.lastName);
      this.infoGroup.controls.email.setValue(this.currentUser!.email);

      if (this.currentUser!.profileImageLink.length > 0) {
        this.profileImageUrl = this.currentUser!.profileImageLink;
      }

      if (this.currentUser!.provider === 'google') {
        this.infoGroup.controls.email.disable();
        this.infoGroup.controls.password.disable();
      }
    });
  }

  ngOnInit(): void {
    this.store.select(selectState).subscribe((result) => {
      if (result.newProfilePictureUrl.length > 0) {
        this.profileImageUrl = result.newProfilePictureUrl;
        this.updateInfos();
      }
    });
  }

  infoGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  updateInfos() {
    this.infoGroup.enable();
    this.loading = false;
    if (this.currentUser!.provider === 'google') {
      this.infoGroup.controls.email.disable();
      this.infoGroup.controls.password.disable();
    }
    if (this.infoGroup.valid) {
      this.store.dispatch(
        updateUserInfoAction({
          objectId: localStorage.getItem('objectId')!,
          firstName: this.infoGroup.value.firstName!,
          lastName: this.infoGroup.value.lastName!,
          email: this.infoGroup.value.email!,
          password:
            this.currentUser!.provider === 'google'
              ? undefined
              : this.infoGroup.value.password!,
          profileImageLink: this.profileImageUrl,
        })
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  hideSettings() {
    this.router.navigate(['/']);
  }

  onImageAdded(e: any) {
    this.file = e.target.files[0];
    this.showImage();
  }

  showImage() {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.file!);
    fileReader.onload = (event: any) => {
      this.profileImageUrl = event.target.result;
    };
  }

  saveProfilePictureChange() {
    if (this.file && this.currentUser) {
      this.loading = true;
      this.infoGroup.disable();
      this.store.dispatch(
        uploadProfilePicAction({
          file: this.file,
          user: this.currentUser.objectId,
        })
      );
    }
  }
}
