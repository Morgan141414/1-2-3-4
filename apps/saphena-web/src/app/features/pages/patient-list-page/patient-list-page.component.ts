import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {PatientService} from '../../../core/services/patient.service';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';
import {PatientTableComponent} from '../../patients/patient-table/patient-table.component';

@Component({
  selector: 'app-patient-list-page',
  imports: [
    PatientTableComponent,
    PaginationComponent,
    FormsModule
  ],
  templateUrl: './patient-list-page.component.html',
  styleUrl: './patient-list-page.component.scss',
  standalone: true
})
export class PatientListPageComponent implements OnInit, OnDestroy {
  private readonly patientService = inject(PatientService);
  private readonly router = inject(Router);

  patients = this.patientService.patients;
  search = this.patientService.search;

  ngOnInit() {
    this.getPatients();
  }

  ngOnDestroy() {
    this.patientService.clearState();
  }

  getPatients(page?: number) {
    this.patientService.getPatients({ page })
      .subscribe();
  }

  openAddPatientPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'patients', 'new'] } }]);
  }

  openEditPatientPanel(id: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'patients', id, 'edit'] } }]);
  }
}
