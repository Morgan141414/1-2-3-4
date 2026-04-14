import {Component, computed, inject, input, output} from '@angular/core';
import {AppointmentProcedureService} from '../../../core/services/appointment-procedure.service';
import {AppointmentProcedure, AppointmentProcedureStatusType} from '../../../core/model/appointment-procedure.model';
import {
  AddAppointmentProcedureDialogComponent
} from '../add-appointment-procedure-dialog/add-appointment-procedure-dialog.component';
import {Appointment, AppointmentStatusType} from '../../../core/model/appointment.model';
import {MatDialog} from '@angular/material/dialog';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-appointment-procedures-tabs',
  imports: [
    NgClass
  ],
  templateUrl: './appointment-procedures-tabs.component.html',
  styleUrl: './appointment-procedures-tabs.component.scss',
  standalone: true
})
export class AppointmentProceduresTabsComponent {
  private readonly appointmentProcedureService = inject(AppointmentProcedureService);
  private readonly dialog = inject(MatDialog);
  protected readonly appointmentStatusType = AppointmentStatusType;
  appointment = input.required<Appointment>();
  activeTab = input.required<AppointmentProcedure>();
  changed = output<AppointmentProcedure>();

  appointmentProcedures = this.appointmentProcedureService.appointmentProcedures;

  assertAllProceduresCompleted = computed(() => {
    return this.appointmentProcedureService.appointmentProcedures()
      ?.some(ap => ap.status === AppointmentProcedureStatusType.IN_PROGRESS);
  });

  addProcedure() {
    const dialogRef = this.dialog.open(AddAppointmentProcedureDialogComponent, {
      data: {
        appointmentId: this.appointment().id,
        doctorId: this.appointment().doctor.id,
        specializationId: this.appointment().specializationId
      }
    });

    dialogRef.afterClosed()
      .subscribe(added => {
        if (added) {
          this.appointmentProcedureService.getAppointmentProcedures(this.appointment().id)
            .subscribe();
        }
      })
  }

}
