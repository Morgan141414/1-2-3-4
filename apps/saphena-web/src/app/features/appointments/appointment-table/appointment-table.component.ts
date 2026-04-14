import {Component, inject, input, output} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatTooltip} from '@angular/material/tooltip';

import {AuthService} from '../../../core/services/auth.service';
import {Appointment, AppointmentStatusType} from '../../../core/model/appointment.model';
import {UserRoleType} from '../../../core/model/user.model';
import {ProcedureType} from '../../../core/model/procedure.model';
import {PatientDocumentVerificationStatus} from '../../../core/model/patient.model';
import {
  getAppointmentStatusName,
  getFullname,
  getPatientDocumentVerificationStatusName, getShortFullName
} from '../../../shared/utils/name.util';
import {VerifyPatientDialogComponent} from '../../patients/verify-patient-dialog/verify-patient-dialog.component';

@Component({
  selector: 'app-appointment-table',
  imports: [
    DatePipe,
    NgClass,
    MatTooltip
  ],
  templateUrl: './appointment-table.component.html',
  styleUrl: './appointment-table.component.scss',
  standalone: true
})
export class AppointmentTableComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  protected readonly role = this.authService.getRole();
  protected readonly userRoleType = UserRoleType;
  protected readonly appointmentStatusType = AppointmentStatusType;
  protected readonly procedureType = ProcedureType;
  protected readonly patientDocumentVerificationStatus = PatientDocumentVerificationStatus;
  protected readonly getAppointmentStatusName = getAppointmentStatusName;
  protected readonly getFullname = getFullname;
  protected readonly getPatientDocumentVerificationStatusName = getPatientDocumentVerificationStatusName;
  verified = output<void>();

  appointments = input.required<Appointment[]>();

  showDetails(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.router.navigate([{ outlets: { panel: ['panels', 'appointments', id] } }]);
  }

  goToAppointmentDetails(appointment: Appointment) {
    if (this.role !== UserRoleType.ROLE_DOCTOR && this.role !== UserRoleType.ROLE_PATIENT) {
      return;
    }

    if (this.role === UserRoleType.ROLE_DOCTOR && !appointment.patient) {
      this.router.navigate([{ outlets: { panel: ['panels', 'attach-patient', appointment.id] } }]);
      return;
    }

    if (this.role === UserRoleType.ROLE_DOCTOR && appointment.patient.verificationStatus === PatientDocumentVerificationStatus.PROVIDED) {
      const dialogRef = this.dialog.open(VerifyPatientDialogComponent, {
        data: appointment.patient.id
      });

      dialogRef.afterClosed()
        .subscribe(result => {
          if (result === true) {
            this.verified.emit();
          }
        });
      return;
    }

    if (this.role === UserRoleType.ROLE_DOCTOR && appointment.status !== AppointmentStatusType.CANCELLED) {
      this.router.navigate([`/appointments/${appointment.id}`]);
      return;
    }

    if (this.role === UserRoleType.ROLE_PATIENT && appointment.status === AppointmentStatusType.COMPLETED) {
      this.router.navigate([`patient/appointments/${appointment.id}`]);
    }
  }

  protected readonly getShortFullName = getShortFullName;
}
