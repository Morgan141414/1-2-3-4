import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs';

import {MeService} from '../../../core/services/me.service';
import {ChangePasswordRequest} from '../../../core/model/auth.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

function confirmPasswordMatchesValidator(control: AbstractControl): ValidationErrors | null {
  const confirm = control.value as string | null;
  const parent = control.parent;

  if (!parent) return null;

  const newPassword = parent.get('newPassword')?.value as string | null;

  if (!confirm || !newPassword) return null;

  return confirm === newPassword ? null : {passwordsMismatch: true};
}

@Component({
  selector: 'app-change-password',
  imports: [
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  standalone: true
})
export class ChangePasswordComponent {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly meService = inject(MeService);

  form = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
    confirmNewPassword: new FormControl('', [Validators.required, confirmPasswordMatchesValidator]),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.form.disable();

    this.meService.changePassword(this.form.value as ChangePasswordRequest)
      .pipe(
        finalize(() => this.form.enable())
      )
      .subscribe(_ => {
        this.matSnackBar.open('Пароль изменен', '', {panelClass: 'snackbar-success'});
        this.form.reset();
      });
  }

}
