import {Component, inject, output, signal} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs';

import {AuthService} from '../../../core/services/auth.service';
import {IinInputFieldComponent} from '../../../shared/components/iin-input-field/iin-input-field.component';
import {OtpInputComponent} from '../../../shared/components/otp-input/otp-input.component';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {CompleteRegistrationRequest} from '../../../core/model/auth.model';

type Step = 1 | 2;

@Component({
  selector: 'app-patient-sign-up',
  imports: [
    IinInputFieldComponent,
    OtpInputComponent,
    InputFieldComponent
  ],
  templateUrl: './patient-sign-up.component.html',
  styleUrl: './patient-sign-up.component.scss',
  standalone: true
})
export class PatientSignUpComponent {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  registrationCompleted = output();

  step = signal<Step>(1);
  loading = signal(false);
  error = signal<string | null>(null);
  iin = new FormControl('',[
    Validators.required,
    Validators.pattern(/^\d{12}$/)
  ]);
  form = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });

  sendRegistrationCode() {
    this.error.set(null);
    if (this.iin.invalid) {
      this.iin.markAsTouched();
      return;
    }

    this.loading.set(true);
    this.authService.startRegistration(this.iin.value!)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: _ => this.step.set(2),
        error: _ => this.error.set('Не удалось отправить код. Попробуйте позже.')
      });
  }

  onCodeChange(v: string) {
    this.form.controls.code.setValue(v);
    this.form.controls.code.updateValueAndValidity();
  }

  completeRegistration() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const req: CompleteRegistrationRequest = {
      iin: this.iin.value!,
      code: this.form.value.code!,
      password: this.form.value.password!
    };
    console.log(req);
    this.authService.completeRegistration(req)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => {
          this.matSnackBar.open('Аккаунт создан. Теперь вы можете войти.', '', { panelClass: 'snackbar-success' })
          this.registrationCompleted.emit();
          this.form.reset();
          this.iin.reset();
        },
        error: (e) => {
          console.log(e);
          this.error.set('Не удалось завершить регистрацию.');
        },
      });
  }

}
