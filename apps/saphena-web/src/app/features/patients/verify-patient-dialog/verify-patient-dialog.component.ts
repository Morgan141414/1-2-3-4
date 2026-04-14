import {Component, inject, OnInit, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import {finalize} from 'rxjs';

import {PatientService} from '../../../core/services/patient.service';
import {Patient} from '../../../core/model/patient.model';
import {getFullname, getPatientDocumentTypeName} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-verify-patient-dialog',
  imports: [
    MatDialogActions,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './verify-patient-dialog.component.html',
  styleUrl: './verify-patient-dialog.component.scss',
  standalone: true
})
export class VerifyPatientDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<VerifyPatientDialogComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly patientService = inject(PatientService);
  protected readonly getFullname = getFullname;
  protected readonly getPatientDocumentTypeName = getPatientDocumentTypeName;

  patient = signal<Patient | null>(null);
  comment = signal('');
  loading = signal<boolean>(false);

  ngOnInit() {
    this.patientService.getPatient(this.data)
      .subscribe(resp => this.patient.set(resp));
  }

  verify() {
    this.loading.set(true);

    this.patientService.verifyPatient(
      this.data,
      this.comment(),
    )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe(_ => this.dialogRef.close(true));
  }

  reject() {
    this.loading.set(true);

    this.patientService.rejectPatientVerification(
      this.data,
      this.comment(),
    )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe(() => this.dialogRef.close(true));
  }

}
