import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

import {PatientService} from '../../../core/services/patient.service';
import {ProtocolService} from '../../../core/services/protocol.service';
import {ProtocolDataService} from '../../../core/services/protocol-data.service';
import {Patient} from '../../../core/model/patient.model';
import {CreateProtocolDataRequest} from '../../../core/model/protocol-data.model';
import {ProtocolFormComponent} from '../../protocols/protocol-form/protocol-form.component';
import {getFullname, getPatientDocumentTypeName} from '../../../shared/utils/name.util';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-patient-documents-page',
  imports: [
    FormsModule,
    ProtocolFormComponent,
  ],
  templateUrl: './patient-documents-page.component.html',
  styleUrl: './patient-documents-page.component.scss',
  standalone: true
})
export class PatientDocumentsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly patientService = inject(PatientService);
  private readonly protocolService = inject(ProtocolService);
  private readonly protocolDataService = inject(ProtocolDataService);
  protected readonly getFullname = getFullname;
  protected readonly getPatientDocumentTypeName = getPatientDocumentTypeName;
  id = input.required<string>();

  protocol = this.protocolService.activeProtocol;
  patient = signal<Patient>({} as Patient);
  loading = signal(false);

  ngOnInit() {
    this.patientService.getPatient(this.id())
      .subscribe(resp => this.patient.set(resp));

    this.router.navigate([{ outlets: { panel: ['panels', 'org-docs'] } }]);
  }

  save(req: CreateProtocolDataRequest) {
    this.loading.set(true);

    this.protocolDataService.saveOrganizationDocumentProtocolData(req)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe()
  }

}
