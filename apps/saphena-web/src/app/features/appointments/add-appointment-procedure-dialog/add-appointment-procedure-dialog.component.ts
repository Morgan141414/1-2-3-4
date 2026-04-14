import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import {NgxMaskDirective} from 'ngx-mask';

import {DoctorProcedureService} from '../../../core/services/doctor-procedure.service';
import {AppointmentProcedureService} from '../../../core/services/appointment-procedure.service';
import {AddAppointmentProcedureRequest} from '../../../core/model/appointment-procedure.model';

@Component({
  selector: 'app-add-appointment-procedure-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective
  ],
  templateUrl: './add-appointment-procedure-dialog.component.html',
  styleUrl: './add-appointment-procedure-dialog.component.scss',
  standalone: true
})
export class AddAppointmentProcedureDialogComponent implements OnInit {
  private readonly doctorProcedureService = inject(DoctorProcedureService);
  private readonly appointmentProcedureService = inject(AppointmentProcedureService);
  private readonly dialogRef = inject(MatDialogRef<AddAppointmentProcedureDialogComponent>);
  data = inject<{
    appointmentId: string,
    doctorId: string,
    specializationId: string
  }>(MAT_DIALOG_DATA);

  doctorProcedures = this.doctorProcedureService.doctorProcedures;
  form = new FormGroup({
    procedureId: new FormControl('', Validators.required),
    actualPrice: new FormControl()
  });

  ngOnInit() {
    this.doctorProcedureService.getDoctorProceduresByDoctorIdAndSpecId(this.data.doctorId, this.data.specializationId)
      .subscribe();
  }

  add() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.appointmentProcedureService.addProcedureToAppointment(
      this.data.appointmentId,
      this.form.value as AddAppointmentProcedureRequest
    ).subscribe(() => this.dialogRef.close(true));
  }

  onProcedureChange() {
    const selectedProcedureId = this.form.controls.procedureId.value;
    const selectedDoctorProcedure = this.doctorProcedures()
      .find(dc => dc.orgProcedure.procedure.id === selectedProcedureId)
    this.form.controls.actualPrice.setValue(selectedDoctorProcedure?.price || '')
  }
}
