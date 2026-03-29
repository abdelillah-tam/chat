import { AbstractControl, ValidationErrors } from "@angular/forms";

export function comparePasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('new_password');
    const confirmation = control.get('password_confirmation');

    if (!password || !confirmation) {
      return null;
    }

    if (password.value !== confirmation.value) {
      return { passwordMismatch: true };
    }

    if (confirmation.value == '') {
      return null;
    }

    return null;
  }
