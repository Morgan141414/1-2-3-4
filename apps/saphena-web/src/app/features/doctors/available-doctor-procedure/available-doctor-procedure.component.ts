import {Component, inject, input, output, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';

import {DoctorProcedureService} from '../../../core/services/doctor-procedure.service';
import {OrganizationProcedure, ProcedureType} from '../../../core/model/procedure.model';
import {AddDoctorProcedureRequest} from '../../../core/model/doctor-procedure.model';
import {DoctorSpecialization} from '../../../core/model/doctor-specialization.model';

@Component({
  selector: 'app-available-doctor-procedure',
  imports: [
    NgClass,
    FormsModule,
    NgxMaskDirective
  ],
  templateUrl: './available-doctor-procedure.component.html',
  styleUrl: './available-doctor-procedure.component.scss',
  standalone: true
})
export class AvailableDoctorProcedureComponent {
  private readonly doctorProcedureService = inject(DoctorProcedureService);
  protected readonly procedureType = ProcedureType;
  orgProcedure = input.required<OrganizationProcedure>();
  doctorSpecialization = input.required<DoctorSpecialization>();
  added = output<void>();

  price = signal(0);

  addProcedure() {
    this.doctorProcedureService.addDoctorProcedure({
      docSpecId: this.doctorSpecialization().id,
      orgProcedureId: this.orgProcedure().id,
      price: this.price(),
    } as AddDoctorProcedureRequest)
      .subscribe(() => this.added.emit());
  }
}
