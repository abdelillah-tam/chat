import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { Store } from '@ngrx/store';
import { selectCurrentLoggedInUser } from '../state/auth/auth.selectors';
import {
  updatePassword,
  updateUserInfo,
  uploadProfilePicAction,
} from '../state/auth/auth.actions';
import { getCurrentUser } from '../model/get-current-user';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { isLoggedIn } from '../model/is-logged-in';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../loading/loading.component';
import { comparePasswordValidator } from '../model/passwordValidator';

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
    MatIcon,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  breakPointObserver = inject(BreakpointObserver);

  isSmallScreen = false;

  currentUser: User | undefined;

  file: File | undefined;

  profileImageUrl: string = '';

  loading: boolean = false;

  selectCurrentLoggedInUser: Subscription | undefined;

  infoFormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  passwordFormGroup = new FormGroup({
    current_password: new FormControl('', [Validators.required]),
    new_password: new FormControl('', [Validators.required]),
    password_confirmation: new FormControl(''),
  });

  matDialog = inject(MatDialog);

  changePassword = false;

  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.passwordFormGroup.addValidators([comparePasswordValidator]);
  }

  ngOnInit(): void {
    this.matDialog.open(LoadingComponent, {
      width: '400px',
      height: '200px',
      disableClose: true,
    });
    this.breakPointObserver.observe(['(width<40rem)']).subscribe((result) => {
      this.isSmallScreen = result.matches;
    });

    if (!isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      getCurrentUser(this.store);
    }

    this.subscribeToStoreSelectors();
  }

  ngOnDestroy(): void {
    this.selectCurrentLoggedInUser?.unsubscribe();
  }

  updateInfos() {
    if (this.infoFormGroup.valid) {
      this.matDialog.open(LoadingComponent, {
        width: '400px',
        height: '200px',
        disableClose: true,
      });
      this.store.dispatch(
        updateUserInfo({
          firstName: this.infoFormGroup.value.firstName!,
          lastName: this.infoFormGroup.value.lastName!,
          email: this.infoFormGroup.value.email!,
        }),
      );
    }
  }

  hideSettings() {
    this.router.navigate(['/']);
  }

  onImageAdded(e: any) {
    this.file = e.target.files[0];
    this.showImageOnImgTag();
  }

  showImageOnImgTag() {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.file!);
    fileReader.onload = (event: any) => {
      this.profileImageUrl = event.target.result;
    };
  }

  saveProfilePictureChange() {
    if (this.file && this.currentUser) {
      this.matDialog.open(LoadingComponent, {
        width: '400px',
        height: '200px',
        disableClose: true,
      });
      let profilePictureFormData = new FormData();
      profilePictureFormData.append('profile_picture', this.file);
      this.loading = true;
      this.store.dispatch(
        uploadProfilePicAction({
          formData: profilePictureFormData,
        }),
      );
    }
  }

  cancel() {
    this.file = undefined;

    this.profileImageUrl = this.currentUser!.profilePictureLink;

    this.fileInput!.nativeElement.value = '';
  }

  private subscribeToStoreSelectors() {
    this.selectCurrentLoggedInUser = this.store
      .select(selectCurrentLoggedInUser)
      .subscribe((result) => {
        if (result && 'firstName' in result) {
          this.matDialog.closeAll();
          this.file = undefined;
          this.currentUser = result;
          if (this.currentUser) {
            this.infoFormGroup.controls.firstName.setValue(
              this.currentUser.firstName,
            );
            this.infoFormGroup.controls.lastName.setValue(
              this.currentUser.lastName,
            );
            this.infoFormGroup.controls.email.setValue(this.currentUser.email);

            this.profileImageUrl = this.currentUser.profilePictureLink;
          }
        }
      });
  }

  
  showPasswordFields() {
    this.changePassword = !this.changePassword;
  }

  savePasswordChange() {
    if (this.passwordFormGroup.valid) {
      this.store.dispatch(
        updatePassword({
          currentPassword: this.passwordFormGroup.value.current_password!,
          newPassword: this.passwordFormGroup.value.new_password!,
          passwordConfirmation:
            this.passwordFormGroup.value.password_confirmation!,
        }),
      );
    }
  }
}
