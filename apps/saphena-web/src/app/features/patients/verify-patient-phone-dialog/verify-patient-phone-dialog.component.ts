  import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
  import {HttpErrorResponse} from '@angular/common/http';
  import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
  import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
  import {finalize, interval, Subscription} from 'rxjs';

  import {PatientService} from '../../../core/services/patient.service';
  import {Patient} from '../../../core/model/patient.model';
  import {OtpInputComponent} from '../../../shared/components/otp-input/otp-input.component';
  import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';
  import {getFullname} from '../../../shared/utils/name.util';
  import {MatSnackBar} from '@angular/material/snack-bar';

  @Component({
    selector: 'app-verify-patient-phone-dialog',
    imports: [
      ReactiveFormsModule,
      MatDialogContent,
      OtpInputComponent,
      PhoneInputFieldComponent
    ],
    templateUrl: './verify-patient-phone-dialog.component.html',
    styleUrl: './verify-patient-phone-dialog.component.scss',
    standalone: true
  })
  export class VerifyPatientPhoneDialogComponent implements OnInit, OnDestroy {
    private readonly dialogRef = inject(MatDialogRef<VerifyPatientPhoneDialogComponent>);
    private readonly data = inject<Patient>(MAT_DIALOG_DATA);
    private readonly matSnackBar = inject(MatSnackBar);
    private readonly patientService = inject(PatientService);
    protected readonly getFullname = getFullname;

    _sub$ = new Subscription();
    _cooldownTimerSub$?: Subscription;

    code = signal('');
    isCodeSent = signal(false);
    loading = signal(false);
    cooldownLeft = signal(0); // seconds
    statusText = signal<string>('');
    phone = new FormControl('', Validators.required);

    codeInvalid = computed(() => !/^\d{6}$/.test(this.code()));

    ngOnInit(): void {
      if (this.data.phone) this.phone.setValue(this.data.phone);
    }

    ngOnDestroy(): void {
      this._sub$.unsubscribe();
      this._cooldownTimerSub$?.unsubscribe();
    }

    sendCode(): void {
      this.statusText.set('');
      this.loading.set(true);

      const s = this.patientService.sendPhoneVerificationCode(
        this.data.id,
        this.phone.value!
      )
        .pipe(
          finalize(() => this.loading.set(false))
        )
        .subscribe({
          next: () => {
            this.startCooldown(60);
            this.isCodeSent.set(true);
          },
          error: (e: HttpErrorResponse) => this.handleSendError(e)
        });

      this._sub$.add(s);
    }

    onCodeChange(v: string) {
      this.code.set(v);
    }

    verify(): void {
      this.loading.set(true);

      const code = this.code(); // <-- берём из OTP

      const s = this.patientService.verifyPhoneVerificationCode(this.data.id, code)
        .pipe(
          finalize(() => this.loading.set(false))
        )
        .subscribe({
          next: (ok) => {
            if (ok) {
              this.matSnackBar.open('Телефон подтвержден', '', { panelClass: 'snackbar-success' })
              this.dialogRef.close(true);
            } else {
              this.statusText.set('Неверный код или код истёк.');
            }
          },
          error: (e) => this.statusText.set(this.toUserMessage(e))
        });

      this._sub$.add(s);
    }


    private handleSendError(e: HttpErrorResponse): void {
      // 429 cooldown with secondsLeft
      if (e.status === 429) {
        this.statusText.set(`Подождите и попробуйте снова.`);
        return;
      }

      // 409/400: phone already verified by another patient (как ты хочешь)
      if (e.status === 409 || e.status === 400) {
        this.statusText.set('Номер уже занят (подтверждён у другого пациента).');
        return;
      }

      this.statusText.set(this.toUserMessage(e));
    }

    private startCooldown(seconds: number): void {
      this._cooldownTimerSub$?.unsubscribe();
      this.cooldownLeft.set(Math.max(0, Math.floor(seconds)));

      this._cooldownTimerSub$ = interval(1000)
        .subscribe(() => {
          const next = this.cooldownLeft() - 1;
          this.cooldownLeft.set(Math.max(0, next));
          if (next <= 0) this._cooldownTimerSub$?.unsubscribe();
        });
    }

    private toUserMessage(e: HttpErrorResponse): string {
      // backend часто возвращает ResponseStatusException со строкой message
      if (typeof e.error === 'string' && e.error.trim().length > 0) return e.error;
      if (e.error?.message) return String(e.error.message);
      return `Ошибка (${e.status}): ${e.statusText || 'Request failed'}`;
    }

  }
