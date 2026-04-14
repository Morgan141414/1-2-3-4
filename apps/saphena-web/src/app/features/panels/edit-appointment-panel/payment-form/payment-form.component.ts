import {Component, inject, input, OnInit, output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs';

import {AppointmentService} from '../../../../core/services/appointment.service';
import {
  Appointment,
  PaymentStatusType,
  PaymentType,
  UpdatePaymentStatusRequest
} from '../../../../core/model/appointment.model';
import {getPaymentStatusName, getPaymentTypeName} from '../../../../shared/utils/name.util';

@Component({
  selector: 'app-payment-form',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss',
  standalone: true
})
export class PaymentFormComponent implements OnInit {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly appointmentService = inject(AppointmentService);
  protected readonly paymentTypes = Object.values(PaymentType);
  protected readonly paymentStatusTypes = Object.values(PaymentStatusType);
  protected readonly getPaymentTypeName = getPaymentTypeName;
  protected readonly getPaymentStatusName = getPaymentStatusName;
  appointment = input.required<Appointment>();
  paymentStatusUpdated = output<void>();
  hideForm = output<void>();

  paymentForm = new FormGroup({
    paymentType: new FormControl(PaymentType.NOT_DEFINED, Validators.required),
    paymentStatus: new FormControl(PaymentStatusType.UNPAID, Validators.required),
  });

  ngOnInit() {
    this.paymentForm.controls.paymentType.setValue(this.appointment().paymentType);
    this.paymentForm.controls.paymentStatus.setValue(this.appointment().paymentStatus);
  }

  save() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.paymentForm.disable();

    this.appointmentService.updatePaymentStatus(
      this.appointment().id,
      this.paymentForm.value as UpdatePaymentStatusRequest
    )
      .pipe(
        finalize(() => {
          this.paymentForm.enable();
        })
      )
      .subscribe(_ => {
        this.matSnackBar.open('Статус оплаты изменен!', '', { panelClass: 'snackbar-success' });
        this.paymentStatusUpdated.emit();
      })
  }

}
