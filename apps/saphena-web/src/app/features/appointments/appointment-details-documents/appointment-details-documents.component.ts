import {Component, computed, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {finalize, switchMap} from 'rxjs';
import {differenceInHours} from 'date-fns/differenceInHours';

import {SpecializationDocumentService} from '../../../core/services/specialization-document.service';
import {ProtocolService} from '../../../core/services/protocol.service';
import {ProtocolDataService} from '../../../core/services/protocol-data.service';
import {DoctorAssistantService} from '../../../core/services/doctor-assistant.service';
import {PdfService} from '../../../core/services/pdf.service';
import {PanelService} from '../../../core/services/panel.service';
import {Appointment} from '../../../core/model/appointment.model';
import {CreateProtocolDataRequest, UpdateProtocolDataRequest} from '../../../core/model/protocol-data.model';
import {ProtocolTargetType} from '../../../core/model/protocol.model';
import {ProtocolFormComponent} from '../../protocols/protocol-form/protocol-form.component';
import {ProtocolDataComponent} from '../../protocols/protocol-data/protocol-data.component';
import {EditProtocolDataFormComponent} from "../../protocols/edit-protocol-data-form/edit-protocol-data-form.component";

@Component({
  selector: 'app-appointment-details-documents',
  imports: [
    ProtocolFormComponent,
    ProtocolDataComponent,
    EditProtocolDataFormComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './appointment-details-documents.component.html',
  styleUrl: './appointment-details-documents.component.scss',
  standalone: true
})
export class AppointmentDetailsDocumentsComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly specializationDocumentService = inject(SpecializationDocumentService);
  private readonly protocolService = inject(ProtocolService);
  private readonly protocolDataService = inject(ProtocolDataService);
  private readonly doctorAssistantsService = inject(DoctorAssistantService);
  private readonly pdfService = inject(PdfService);
  private readonly panelService = inject(PanelService);
  appointment = input.required<Appointment>();

  activeSpecializationDocumentId = this.specializationDocumentService.activeSpecializationDocumentId;
  protocol = this.protocolService.activeProtocol;
  protocolData = this.protocolDataService.protocolData;
  doctorAssistants = this.doctorAssistantsService.doctorAssistants;
  isEdit = signal(false);
  loading = signal(false);
  lang = signal('ru');

  canEdit = computed(() =>
    differenceInHours(new Date(), new Date(this.protocolData()!.createdAt)) <= 24
  );

  ngOnInit() {
    this.openAppointmentDocumentsPanel();
  }

  ngOnDestroy() {
    this.specializationDocumentService.clearState();
    this.protocolService.clearState();
    this.protocolDataService.clearState();
    this.panelService.closePanel();
  }

  save(req: CreateProtocolDataRequest) {
    this.loading.set(true);

    req.appointmentId = this.appointment().id;
    this.protocolDataService.saveSpecializationDocumentProtocolData(req)
      .pipe(
        switchMap(() => this.protocolDataService.getAppointmentSpecializationDocuments(this.appointment().id)),
        switchMap(() => this.protocolDataService.getProtocolData(
          ProtocolTargetType.SPEC_DOC,
          this.activeSpecializationDocumentId()!,
          this.appointment().id,
        )),
        finalize(() => this.loading.set(false))
      )
      .subscribe()
  }

  edit(req: UpdateProtocolDataRequest) {
    this.loading.set(true);

    this.protocolDataService.updateProcedureProtocolData(
      this.protocolData()!.id,
      req,
    )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe(() => {
        this.isEdit.set(false);
        this.protocolDataService.getProtocolData(
          ProtocolTargetType.SPEC_DOC,
          this.activeSpecializationDocumentId()!,
          this.appointment().id,
        )
          .subscribe();
      })
  }

  downloadPdf() {
    this.loading.set(true);

    this.pdfService.downloadPdf(
      ProtocolTargetType.SPEC_DOC,
      this.protocolData()!.id,
      this.lang(),
    )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe()
  }

  private openAppointmentDocumentsPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'appointment-documents'] } }]);
  }
}
