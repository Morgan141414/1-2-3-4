import {Component, inject, signal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';

import {AppointmentService} from '../../../core/services/appointment.service';
import {switchMap} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-close-appointment-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './close-appointment-dialog.component.html',
  styleUrl: './close-appointment-dialog.component.scss',
  standalone: true
})
export class CloseAppointmentDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CloseAppointmentDialogComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly appointmentService = inject(AppointmentService);

  comment = signal<string>('');

  close() {
    this.appointmentService.closeAppointment(this.data.appointmentId, this.comment())
      .pipe(
        switchMap(() => this.appointmentService.getAppointment(this.data.appointmentId))
      )
      .subscribe(() => {
        this.dialogRef.close();
        this.matSnackBar.open('Запись закрыта', '', { panelClass: 'snackbar-success' })

      });
  }
}
