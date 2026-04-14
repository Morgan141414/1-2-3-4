import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {addMinutes, differenceInMinutes, format} from 'date-fns';
import {finalize} from 'rxjs';

import {AppointmentService} from '../../../../core/services/appointment.service';
import {Appointment} from '../../../../core/model/appointment.model';
import {
  DateTimeInputFieldComponent
} from '../../../../shared/components/date-time-input-field/date-time-input-field.component';

@Component({
  selector: 'app-reschedule-form',
  imports: [
    DateTimeInputFieldComponent
  ],
  templateUrl: './reschedule-form.component.html',
  styleUrl: './reschedule-form.component.scss',
  standalone: true
})
export class RescheduleFormComponent implements OnInit {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly appointmentService = inject(AppointmentService);
  appointment = input.required<Appointment>();
  hideForm = output<void>();
  rescheduled = output<void>();

  timeDifference = signal(10);
  rescheduleForm = new FormGroup({
    start: new FormControl<string>('', Validators.required),
    end: new FormControl<string>('', Validators.required)
  });

  ngOnInit() {
    this.rescheduleForm.controls.start.setValue(this.appointment().datetime);
    this.rescheduleForm.controls.end.setValue(this.appointment().endDatetime);
    this.timeDifference.set(
      differenceInMinutes(this.appointment().endDatetime, this.appointment().datetime),
    )
  }

  setEndDateTime() {
    const datetime = this.rescheduleForm.controls.start.value;
    if (datetime) {
      const end = addMinutes(new Date(datetime), this.timeDifference());
      const formatted = format(end, "yyyy-MM-dd'T'HH:mm");
      this.rescheduleForm.controls.end.setValue(formatted);
    } else {
      this.rescheduleForm.controls.end.setValue('');
    }
  }

  reschedule() {
    if (this.rescheduleForm.invalid) {
      this.rescheduleForm.markAllAsTouched();
      return;
    }
    this.rescheduleForm.disable();

    this.appointmentService.rescheduleAppointment(
      this.appointment().id,
      this.rescheduleForm.controls.start.value!,
      this.rescheduleForm.controls.end.value!
    )
      .pipe(
        finalize(() => {
          this.rescheduleForm.enable();
        })
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Запись перенесена!', '', { panelClass: 'snackbar-success' });
          this.rescheduled.emit();
        },
        error: (err) => {
          if (err.status === 400) {
            this.matSnackBar.open('Запись перенесена!', '', { panelClass: 'snackbar-success' })
              .afterDismissed()
              .subscribe(_ =>
                this.matSnackBar.open(
                  err.error?.detail,
                  '',
                  { duration: 4000, panelClass: 'snackbar-warning' }
                )
              );
            this.rescheduled.emit();
          }
        }
      })
  }

}
