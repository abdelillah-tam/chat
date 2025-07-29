import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
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
  selectProfilePictureLink,
  selectTokenValidation,
} from '../state/auth/auth.selectors';
import {
  checkIfTokenIsValidAction,
  getProfilePictureLinkAction,
  updateUserInfoAction,
  uploadProfilePicAction,
} from '../state/auth/auth.actions';
import { getCurrentUser } from '../model/get-current-user';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { isLoggedIn } from '../model/is-logged-in';

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
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  currentUser: User | undefined;

  file: File | undefined;

  profileImageUrl: string = '';

  loading: boolean = false;

  selectCurrentLoggedInUser: Subscription | undefined;

  selectTokenValidation: Subscription | undefined;

  selectNewProfilePictureState: Subscription | undefined;

  selectProfilePictureLinkState: Subscription | undefined;

  infoGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  constructor(private store: Store, private router: Router) {
    let validator: ValidatorFn = (formGroup) => {
      if (!this.infoGroup.controls.email.disabled) {
        return formGroup.get('firstName')?.valid &&
          formGroup.get('lastName')?.valid &&
          formGroup.get('email')?.valid
          ? null
          : { error: 'invalid' };
      } else {
        return formGroup.get('firstName')?.valid &&
          formGroup.get('lastName')?.valid
          ? null
          : { error: 'invalid' };
      }
    };
    this.infoGroup.addValidators(validator);
  }

  ngOnInit(): void {
    if (!isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      getCurrentUser(this.store);
    }

    this.store.dispatch(
      getProfilePictureLinkAction({
        objectId: localStorage.getItem('objectId')!,
      })
    );

    this.store.dispatch(checkIfTokenIsValidAction());

    this.subscribeToStoreSelectors();
  }

  ngOnDestroy(): void {
    this.selectCurrentLoggedInUser?.unsubscribe();
    this.selectNewProfilePictureState?.unsubscribe();
    this.selectProfilePictureLinkState?.unsubscribe();
  }

  updateInfos() {
    this.loading = false;
    if (this.currentUser?.provider === 'google') {
      this.infoGroup.controls.firstName.enable();
      this.infoGroup.controls.lastName.enable();
    } else {
      this.infoGroup.enable();
    }

    if (this.infoGroup.valid) {
      if (this.currentUser?.provider === 'google') {
        this.store.dispatch(
          updateUserInfoAction({
            objectId: localStorage.getItem('objectId')!,
            firstName: this.infoGroup.value.firstName!,
            lastName: this.infoGroup.value.lastName!,
            email: this.infoGroup.value.email!,
            password: undefined,
            provider: this.currentUser.provider,
          })
        );
      } else {
        this.store.dispatch(
          updateUserInfoAction({
            objectId: localStorage.getItem('objectId')!,
            firstName: this.infoGroup.value.firstName!,
            lastName: this.infoGroup.value.lastName!,
            email: this.infoGroup.value.email!,
            password: this.infoGroup.value.password!,
            provider: this.currentUser!.provider,
          })
        );
      }
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
      this.store.dispatch(
        uploadProfilePicAction({
          file: this.file,
          userId: this.currentUser.id,
        })
      );
    }
  }

  cancel() {
    this.file = undefined;
    if (this.currentUser) {
      this.profileImageUrl = this.currentUser.profilePictureLink;
    } else {
      this.profileImageUrl = '';
    }

    this.fileInput!.nativeElement.value = '';
  }

  private subscribeToStoreSelectors() {
    this.selectTokenValidation = this.store
      .select(selectTokenValidation)
      .subscribe((result) => {
        if (result === false) {
          localStorage.clear(); // delete any existing data
          this.router.navigate(['/login']);
        }
      });

    this.selectCurrentLoggedInUser = this.store
      .select(selectCurrentLoggedInUser)
      .subscribe((result) => {
        if (result && 'firstName' in result) {
          this.currentUser = result;
          if (this.currentUser) {
            this.infoGroup.controls.firstName.setValue(
              this.currentUser.firstName
            );
            this.infoGroup.controls.lastName.setValue(
              this.currentUser.lastName
            );
            this.infoGroup.controls.email.setValue(this.currentUser.email);

            if (this.currentUser?.provider === 'google') {
              this.infoGroup.controls.email.disable();
              this.infoGroup.controls.password.disable();
            }
          }
        }
      });

    this.selectProfilePictureLinkState = this.store
      .select(selectProfilePictureLink)
      .subscribe((result) => {
        if (result) {
          this.loading = false;
          this.profileImageUrl = result.toString();
          this.file = undefined;
        }
      });
  }
}
