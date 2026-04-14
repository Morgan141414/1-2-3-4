import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {NgClass} from '@angular/common';

import {AppointmentService} from '../../../core/services/appointment.service';
import {SpecializationDocumentService} from '../../../core/services/specialization-document.service';
import {ProtocolService} from '../../../core/services/protocol.service';
import {ProtocolDataService} from '../../../core/services/protocol-data.service';
import {SpecializationDocument} from '../../../core/model/specialization-document.model';
import {AppointmentStatusType} from '../../../core/model/appointment.model';
import {ProtocolTargetType} from '../../../core/model/protocol.model';

@Component({
  selector: 'app-appointment-documents-panel',
  imports: [
    NgClass
  ],
  templateUrl: './appointment-documents-panel.component.html',
  styleUrl: './appointment-documents-panel.component.scss',
  standalone: true
})
export class AppointmentDocumentsPanelComponent implements OnInit {
  private readonly protocolService = inject(ProtocolService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly specializationDocumentService = inject(SpecializationDocumentService);
  private readonly protocolDataService = inject(ProtocolDataService);
  protected readonly appointmentStatusType = AppointmentStatusType;

  appointment = this.appointmentService.appointmentDetails;
  savedDocuments = this.protocolDataService.appointmentSpecDocs;
  activeDocId = this.specializationDocumentService.activeSpecializationDocumentId;
  specDocs = signal<SpecializationDocument[]>([]);


  availableDocuments = computed<SpecializationDocument[]>(() => {
    return this.specDocs()
      .filter(d => !this.savedDocuments().some(sd => sd.id === d.id))
  })

  ngOnInit() {
    this.getSpecializationDocumentCatalog();
    this.getSavedSpecializationDocuments();
  }

  selectSavedDocument(id: string) {
    if (this.activeDocId() === id) return;

    this.specializationDocumentService.activeSpecializationDocumentId.set(id);
    this.protocolDataService.getProtocolData(
      ProtocolTargetType.SPEC_DOC,
      this.activeDocId(),
      this.appointment().id,
    )
      .subscribe();
    this.getSpecDocActiveProtocol();
  }

  selectDocument(id: string) {
    if (this.activeDocId() === id) return;

    this.protocolDataService.clearProtocolData();
    this.protocolService.clearState();
    this.activeDocId.set(id);
    this.getSpecDocActiveProtocol();
  }

  private getSpecializationDocumentCatalog() {
    this.specializationDocumentService.getSpecDocCatalog(this.appointment().specializationId)
      .subscribe(resp => this.specDocs.set(resp));
  }

  private getSavedSpecializationDocuments() {
    this.protocolDataService.getAppointmentSpecializationDocuments(this.appointment().id)
      .subscribe()
  }

  private getSpecDocActiveProtocol() {
    this.protocolService.getActiveProtocol(
      ProtocolTargetType.SPEC_DOC,
      this.activeDocId()
    )
      .subscribe();
  }

}
