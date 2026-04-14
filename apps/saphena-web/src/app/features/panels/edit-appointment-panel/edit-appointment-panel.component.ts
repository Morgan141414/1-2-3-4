import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {map, switchMap} from 'rxjs';

import {AppointmentService} from '../../../core/services/appointment.service';
import {PanelService} from '../../../core/services/panel.service';
import {CalendarService} from '../../../core/services/calendar.service';
import {PatientService} from '../../../core/services/patient.service';
import {AuthService} from '../../../core/services/auth.service';
import {
  Appointment,
  AppointmentStatusType,
} from '../../../core/model/appointment.model';
import {PatientDocumentVerificationStatus} from '../../../core/model/patient.model';
import {UserRoleType} from '../../../core/model/user.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {VerifyPatientDialogComponent} from '../../patients/verify-patient-dialog/verify-patient-dialog.component';
import {
  VerifyPatientPhoneDialogComponent
} from '../../patients/verify-patient-phone-dialog/verify-patient-phone-dialog.component';
import {
  AppointmentDetailsComponent
} from './appointment-details/appointment-details.component';
import {RescheduleFormComponent} from './reschedule-form/reschedule-form.component';
import {AttachmentFormComponent} from './attachment-form/attachment-form.component';
import {PaymentFormComponent} from './payment-form/payment-form.component';
import {getFullname} from '../../../shared/utils/name.util';

enum VisibleFormType {
  RESCHEDULE = 'RESCHEDULE',
  ATTACHMENT = 'ATTACHMENT',
  PAYMENT = 'PAYMENT',
}

@Component({
  selector: 'app-edit-appointment-panel',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    AppointmentDetailsComponent,
    RescheduleFormComponent,
    AttachmentFormComponent,
    PaymentFormComponent
  ],
  templateUrl: './edit-appointment-panel.component.html',
  styleUrl: './edit-appointment-panel.component.scss',
  standalone: true
})
export class EditAppointmentPanelComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly appointmentService = inject(AppointmentService);
  private readonly calendarService = inject(CalendarService);
  private readonly patientService = inject(PatientService);
  private readonly panelService = inject(PanelService);
  private readonly authService = inject(AuthService);
  protected readonly userRoleType = UserRoleType;
  protected readonly VisibleFormType = VisibleFormType;
  protected readonly getFullname = getFullname;
  protected readonly role = this.authService.getRole();
  id = input.required<string>();

  patients = this.patientService.patients;
  search = this.patientService.search;
  appointment = signal<Appointment>({} as Appointment);
  visibleForm = signal<VisibleFormType | null>(null);

  get canAttachPatient(): boolean {
    return (
      !this.appointment().patient &&
      !!this.appointment().tempPatientName &&
      !!this.appointment().tempPatientPhone &&
      this.appointment().status === AppointmentStatusType.SCHEDULED
    );
  }

  get canVerifyPatient(): boolean {
    return (
      !!this.appointment().patient &&
      this.appointment().patient.verificationStatus === PatientDocumentVerificationStatus.PROVIDED &&
      this.role !== UserRoleType.ROLE_OPERATOR
      );
  }

  get canVerifyPatientPhone(): boolean {
    return (
      !!this.appointment().patient &&
      this.appointment().patient.verificationStatus === PatientDocumentVerificationStatus.VERIFIED &&
      !this.appointment().patient.phoneVerified
    );
  }

  get canPrintDocuments(): boolean {
    return (
      !!this.appointment().patient &&
      this.appointment().patient.verificationStatus === PatientDocumentVerificationStatus.VERIFIED &&
      this.role !== UserRoleType.ROLE_OPERATOR
    );
  }

  get canReschedule(): boolean {
    return this.appointment().status === AppointmentStatusType.SCHEDULED
  }

  ngOnInit() {
    this.getAppointment();
  }

  ngOnDestroy() {
    this.patientService.clearState();
  }

  onPatientAttached() {
    this.getAppointment();
    this.getAppointments();
    this.visibleForm.set(null);
  }

  onPaymentStatusUpdated() {
    this.getAppointment();
    this.visibleForm.set(null);
  }

  onRescheduled() {
    this.panelService.closePanel();
    this.getAppointments();
  }

  verifyPatient() {
    const dialogRef = this.dialog.open(VerifyPatientDialogComponent, {
      data: this.appointment().patient.id
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.getAppointment();
          this.getAppointments();
        }
      });
  }

  verifyPatientPhone() {
    const dialogRef = this.dialog.open(VerifyPatientPhoneDialogComponent, {
      data: this.appointment().patient
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.getAppointment();
          this.getAppointments();
        }
      });
  }

  cancel() {
    const name = this.appointment().patient ?
      getFullname(this.appointment().patient.firstName, this.appointment().patient.lastName, this.appointment().patient.middleName) :
      this.appointment().tempPatientName;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `${name} - ${new DatePipe('en-US').transform(this.appointment().datetime, 'dd.MM.yyyy HH:mm')}`,
        subtitle: `Вы уверены что хотите отменить запись?`
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.appointmentService.cancelAppointment(this.appointment().id)
            .subscribe({
              next: _ => {
                this.getAppointments();
                this.matSnackBar.open('Запись отменена!', '', { panelClass: 'snackbar-success' });
                this.panelService.closePanel();
              },
              error: (err) => {
                if (err.status === 400) {
                  this.getAppointments();
                  this.panelService.closePanel();
                  this.matSnackBar.open('Запись отменена!', '', { panelClass: 'snackbar-success' })
                    .afterDismissed()
                    .subscribe(_ =>
                      this.matSnackBar.open(
                        err.error?.detail,
                        '',
                        { duration: 4000, panelClass: 'snackbar-warning' }
                      )
                    );
                }
              }
            })
        }
      })
  }

  private getAppointment() {
    this.route.params
      .pipe(
        map(params => params["id"]),
        switchMap(id => this.appointmentService.getAppointment(id))
      )
      .subscribe(resp => {
        this.appointment.set(resp);
      });
  }

  private getAppointments() {
    if (this.router.url.includes('calendar')) {
      this.calendarService.getCalendarEvents()
        .subscribe();
    } else {
      this.appointmentService.getAppointments()
        .subscribe();
    }
  }

}
