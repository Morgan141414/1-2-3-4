import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {finalize} from 'rxjs';

import {AppointmentService} from '../../../core/services/appointment.service';
import {AppointmentProcedureService} from '../../../core/services/appointment-procedure.service';
import {ProtocolDataService} from '../../../core/services/protocol-data.service';
import {PdfService} from '../../../core/services/pdf.service';
import {AppointmentProcedure} from '../../../core/model/appointment-procedure.model';
import {ITab, TabsComponent} from '../../../shared/components/tabs/tabs.component';
import {
  AppointmentDetailsHeaderComponent
} from '../../appointments/appointment-details-header/appointment-details-header.component';
import {ProtocolDataComponent} from '../../protocols/protocol-data/protocol-data.component';
import {SpecializationDocument} from '../../../core/model/specialization-document.model';
import {ProtocolTargetType} from '../../../core/model/protocol.model';

@Component({
  selector: 'app-patient-appointment-details-page',
  imports: [
    FormsModule,
    NgClass,
    AppointmentDetailsHeaderComponent,
    TabsComponent,
    ProtocolDataComponent
  ],
  templateUrl: './patient-appointment-details-page.component.html',
  styleUrl: './patient-appointment-details-page.component.scss',
  standalone: true
})
export class PatientAppointmentDetailsPageComponent implements OnInit, OnDestroy {
  private readonly appointmentService = inject(AppointmentService);
  private readonly appointmentProcedureService = inject(AppointmentProcedureService);
  private readonly protocolDataService = inject(ProtocolDataService);
  private readonly pdfService = inject(PdfService);
  appointment = this.appointmentService.appointmentDetails;
  appointmentProcedures = this.appointmentProcedureService.appointmentProcedures;
  protocolData = this.protocolDataService.protocolData;
  appointmentSpecDocs = this.protocolDataService.appointmentSpecDocs;
  id = input.required<string>();

  tabs: ITab[] = [
    {
      id: 'procedures',
      title: 'Услуги'
    },
    {
      id: 'documents',
      title: 'Документы'
    }
  ];
  activeTab = signal(this.tabs[0].id);
  procedureTab = signal<AppointmentProcedure>({} as AppointmentProcedure);
  specDocTab = signal<SpecializationDocument>({} as SpecializationDocument);
  loading = signal(false);
  lang = signal('ru');

  ngOnInit() {
    this.getAppointment();
    this.getAppointmentProcedures();
    this.getSavedSpecializationDocuments();
  }

  ngOnDestroy() {
    this.appointmentService.clearAppointmentDetails();
    this.appointmentProcedureService.clearState();
    this.protocolDataService.clearState();
  }

  selectTab(id: string) {
    if (this.activeTab() === id) return;

    this.activeTab.set(id);
    this.protocolDataService.clearProtocolData();
    if (id === 'procedures') {
      this.getProtocolData(this.procedureTab().procedure.id);
    } else if (id === 'documents') {
      this.getSpecDocProtocolData(this.specDocTab().id);
    }
  }

  selectProcedure(ap: AppointmentProcedure) {
    if (this.procedureTab() === ap) return;

    this.procedureTab.set(ap);
    this.protocolDataService.clearProtocolData();
    this.getProtocolData(ap.procedure.id);
  }

  selectSpecDoc(specDoc: SpecializationDocument) {
    if (this.specDocTab() === specDoc) return;

    this.specDocTab.set(specDoc);
    this.protocolDataService.clearProtocolData();
    this.getSpecDocProtocolData(specDoc.id);
  }

  downloadPdf() {
    this.loading.set(true);

    this.pdfService.downloadPdf(
      ProtocolTargetType.PROCEDURE,
      this.protocolData()!.id,
      this.lang()
    )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe()
  }

  downloadSpecDocument() {
    this.loading.set(true);

    this.pdfService.downloadPdf(
      ProtocolTargetType.SPEC_DOC,
      this.protocolData()!.id,
      this.lang()
    )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe()
  }

  private getAppointment() {
    this.appointmentService.getAppointment(this.id())
      .subscribe();
  }

  private getAppointmentProcedures() {
    this.appointmentProcedureService.getAppointmentProcedures(this.id())
      .subscribe(resp => {
        this.selectProcedure(resp![0]);
      });
  }

  private getSavedSpecializationDocuments() {
    this.protocolDataService.getAppointmentSpecializationDocuments(this.id())
      .subscribe(resp => {
        this.specDocTab.set(resp[0] ?? '')
      })
  }

  private getProtocolData(procedureId: string) {
    this.loading.set(true);

    this.protocolDataService.getProtocolData(
      ProtocolTargetType.PROCEDURE,
      procedureId,
      this.id(),
    )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe();
  }

  private getSpecDocProtocolData(specDocId: string) {
    if (this.appointmentSpecDocs().length < 1) return;

    this.loading.set(true);

    this.protocolDataService.getProtocolData(
      ProtocolTargetType.SPEC_DOC,
      specDocId,
      this.id()
    )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe();
  }
}
