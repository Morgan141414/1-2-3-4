import {Component, input} from '@angular/core';
import {NgxMaskPipe} from 'ngx-mask';
import {DatePipe, NgClass} from '@angular/common';

import {Appointment} from '../../../../core/model/appointment.model';
import {PatientDocumentVerificationStatus} from '../../../../core/model/patient.model';
import {
  getFullname,
  getPatientDocumentVerificationStatusName, getPaymentStatusName,
  getPaymentTypeName
} from '../../../../shared/utils/name.util';

@Component({
  selector: 'app-appointment-details',
  imports: [
    NgxMaskPipe,
    DatePipe,
    NgClass
  ],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss',
  standalone: true
})
export class AppointmentDetailsComponent {
  protected readonly patientDocumentVerificationStatus = PatientDocumentVerificationStatus;
  protected readonly getPatientDocumentVerificationStatusName = getPatientDocumentVerificationStatusName;
  protected readonly getFullname = getFullname;
  appointment = input.required<Appointment>();

  protected readonly getPaymentTypeName = getPaymentTypeName;
  protected readonly getPaymentStatusName = getPaymentStatusName;
}
