import {Component, inject, input, OnDestroy, output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {finalize} from 'rxjs';

import {PatientService} from '../../../../core/services/patient.service';
import {AppointmentService} from '../../../../core/services/appointment.service';
import {Appointment} from '../../../../core/model/appointment.model';
import {getFullname} from '../../../../shared/utils/name.util';

@Component({
  selector: 'app-attachment-form',
  imports: [
    FormsModule,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
  ],
  templateUrl: './attachment-form.component.html',
  styleUrl: './attachment-form.component.scss',
  standalone: true
})
export class AttachmentFormComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly appointmentService = inject(AppointmentService);
  private readonly patientService = inject(PatientService);
  protected readonly getFullname = getFullname;
  appointment = input.required<Appointment>();
  hideForm = output<void>();
  attached = output<void>();

  patients = this.patientService.patients;
  search = this.patientService.search;
  patientIdControl = new FormControl('', Validators.required);

  ngOnDestroy() {
    this.patientService.clearState();
  }

  getPatients() {
    this.patientService.getPatients({ size: 100 })
      .subscribe()
  }

  openAddPatientPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'patients', 'new'] } }]);
  }

  attachPatient() {
    if (this.patientIdControl.invalid) {
      this.patientIdControl.markAsTouched();
      return;
    }

    this.patientIdControl.disable();

    this.appointmentService.attachPatient(
      this.appointment().id,
      this.patientIdControl.value!
    )
      .pipe(
        finalize(() => this.patientIdControl.enable())
      )
      .subscribe(_ => {
        this.attached.emit();
      })
  }

}
