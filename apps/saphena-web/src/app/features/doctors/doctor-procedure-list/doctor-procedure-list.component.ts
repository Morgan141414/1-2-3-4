import {Component, computed, inject, input, OnChanges, OnDestroy, signal} from '@angular/core';

import {OrganizationProcedureService} from '../../../core/services/organization-procedure.service';
import {DoctorProcedureService} from '../../../core/services/doctor-procedure.service';
import {OrganizationProcedure, ProcedureType} from '../../../core/model/procedure.model';
import {DoctorSpecialization} from '../../../core/model/doctor-specialization.model';
import {ActiveDoctorProcedureComponent} from '../active-doctor-procedure/active-doctor-procedure.component';
import {AvailableDoctorProcedureComponent} from '../available-doctor-procedure/available-doctor-procedure.component';

@Component({
  selector: 'app-doctor-procedure-list',
  imports: [
    ActiveDoctorProcedureComponent,
    AvailableDoctorProcedureComponent
  ],
  templateUrl: './doctor-procedure-list.component.html',
  styleUrl: './doctor-procedure-list.component.scss',
  standalone: true
})
export class DoctorProcedureListComponent implements OnChanges, OnDestroy {
  private readonly organizationProcedureService = inject(OrganizationProcedureService);
  private readonly doctorProcedureService = inject(DoctorProcedureService);
  protected readonly procedureType = ProcedureType;
  doctorSpecialization = input.required<DoctorSpecialization>();

  orgProcedures = signal<OrganizationProcedure[]>([]);
  doctorProcedures = this.doctorProcedureService.doctorProcedures;

  availableProcedures = computed<OrganizationProcedure[]>(() => {
    return this.orgProcedures()
      .filter(op => !this.doctorProcedures()
        .some(dp => op.id === dp.orgProcedure.id)
      )
  });

  ngOnChanges() {
    this.getOrgProcedures();
    this.getDoctorProcedures();
  }

  ngOnDestroy() {
    this.doctorProcedureService.cleatState();
  }

  getDoctorProcedures() {
    this.doctorProcedureService.getDoctorProceduresByDocSpecId(this.doctorSpecialization().id)
      .subscribe();
  }

  private getOrgProcedures() {
    this.organizationProcedureService.getOrgProcedureCatalog(this.doctorSpecialization().specialization.id)
      .subscribe(resp => this.orgProcedures.set(resp));
  }

}
