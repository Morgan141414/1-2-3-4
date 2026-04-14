import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

import {SpecializationService} from '../../../core/services/specialization.service';
import {DoctorService} from '../../../core/services/doctor.service';
import {ProtocolField} from '../../../core/model/protocol.model';
import {Doctor} from '../../../core/model/doctor.model';
import {Specialization} from '../../../core/model/specialization.model';
import {ProtocolDataFormSectionField} from '../../../core/model/protocol-data.model';
import {getFullname} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-protocol-doctor-select-field',
  imports: [
    MatOption,
    MatSelect,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './protocol-doctor-select-field.component.html',
  styleUrl: './protocol-doctor-select-field.component.scss',
  standalone: true
})
export class ProtocolDoctorSelectFieldComponent implements OnInit {
  private readonly doctorService = inject(DoctorService);
  private readonly specializationService = inject(SpecializationService);
  protected readonly getFullname = getFullname;
  field = input.required<ProtocolField>();
  control = input.required<FormGroup<ProtocolDataFormSectionField>>();

  specialization = signal<Specialization | null>(null);
  doctors = signal<Doctor[]>([]);

  ngOnInit() {
    this.getDoctors();
    this.getSpecialization();
  }

  doctorFullname(doctor: Doctor) {
    return getFullname(doctor.firstName, doctor.lastName, doctor.middleName);
  }

  private getDoctors() {
    this.doctorService.getDoctorList(this.field().doctorSpecializationId!)
      .subscribe(resp => this.doctors.set(resp));
  }

  private getSpecialization() {
    this.specializationService.getSpecialization(this.field().doctorSpecializationId!)
      .subscribe(resp => this.specialization.set(resp));
  }

  onChange() {
    const selectedDoctors = this.control().controls.doctorIds.value as string[];
    const doctorNames = this.doctors()
      .filter(a => selectedDoctors.includes(a.id))
      .map(a => getFullname(a.firstName, a.lastName, a.middleName))
      .join(", ");

    this.control().controls.value.setValue(doctorNames);
  }
}
