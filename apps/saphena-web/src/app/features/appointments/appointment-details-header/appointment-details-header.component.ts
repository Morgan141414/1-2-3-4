import {Component, computed, inject, input, output} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';

import {AppointmentProcedureService} from '../../../core/services/appointment-procedure.service';
import {Patient} from '../../../core/model/patient.model';
import {AppointmentProcedureStatusType} from '../../../core/model/appointment-procedure.model';
import {AppointmentStatusType} from '../../../core/model/appointment.model';
import {CloseAppointmentDialogComponent} from '../close-appointment-dialog/close-appointment-dialog.component';
import {getAppointmentStatusName, getFullname, getPatientDocumentTypeName} from '../../../shared/utils/name.util';
import {AuthService} from '../../../core/services/auth.service';
import {UserRoleType} from '../../../core/model/user.model';

@Component({
  selector: 'app-appointment-details-header',
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './appointment-details-header.component.html',
  styleUrl: './appointment-details-header.component.scss',
  standalone: true
})
export class AppointmentDetailsHeaderComponent {
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly appointmentProcedureService = inject(AppointmentProcedureService);
  protected readonly role = this.authService.getRole();
  protected readonly appointmentStatusType = AppointmentStatusType;
  protected readonly UserRoleType = UserRoleType;
  protected readonly getFullname = getFullname;
  protected readonly getPatientDocumentTypeName = getPatientDocumentTypeName;
  protected readonly getAppointmentStatusName = getAppointmentStatusName;
  id = input.required<string>();
  status = input.required<AppointmentStatusType>();
  datetime = input.required<string>();
  patient = input<Patient>();
  closed = output<void>();

  assertAllProceduresAndDocumentsCompleted = computed(() => {
    return this.appointmentProcedureService.appointmentProcedures()
      ?.some(ap => ap.status === AppointmentProcedureStatusType.IN_PROGRESS);
  })

  closeAppointment() {
    this.dialog.open(CloseAppointmentDialogComponent, {
      data: { appointmentId: this.id() },
      maxWidth: '600px',
      width: '90vw',
    });
  }

}
