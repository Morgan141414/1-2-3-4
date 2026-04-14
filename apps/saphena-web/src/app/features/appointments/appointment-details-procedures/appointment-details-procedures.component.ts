import {Component, computed, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {finalize, switchMap} from 'rxjs';
import {differenceInHours} from 'date-fns/differenceInHours';

import {AppointmentProcedureService} from '../../../core/services/appointment-procedure.service';
import {ProtocolDataService} from '../../../core/services/protocol-data.service';
import {ProtocolService} from '../../../core/services/protocol.service';
import {DoctorAssistantService} from '../../../core/services/doctor-assistant.service';
import {PdfService} from '../../../core/services/pdf.service';
import {CreateProtocolDataRequest, UpdateProtocolDataRequest} from '../../../core/model/protocol-data.model';
import {AppointmentProcedure, AppointmentProcedureStatusType} from '../../../core/model/appointment-procedure.model';
import {Appointment} from '../../../core/model/appointment.model';
import {AppointmentProceduresTabsComponent} from '../appointment-procedures-tabs/appointment-procedures-tabs.component';
import {ProtocolFormComponent} from '../../protocols/protocol-form/protocol-form.component';
import {ProtocolDataComponent} from '../../protocols/protocol-data/protocol-data.component';
import {EditProtocolDataFormComponent} from '../../protocols/edit-protocol-data-form/edit-protocol-data-form.component';
import {FormsModule} from '@angular/forms';
import {ProtocolTargetType} from '../../../core/model/protocol.model';

@Component({
  selector: 'app-appointment-details-procedures',
  imports: [
    AppointmentProceduresTabsComponent,
    ProtocolFormComponent,
    ProtocolDataComponent,
    EditProtocolDataFormComponent,
    FormsModule
  ],
  templateUrl: './appointment-details-procedures.component.html',
  styleUrl: './appointment-details-procedures.component.scss',
  standalone: true
})
export class AppointmentDetailsProceduresComponent implements OnInit, OnDestroy {
  private readonly appointmentProcedureService = inject(AppointmentProcedureService);
  private readonly protocolService = inject(ProtocolService);
  private readonly protocolDataService = inject(ProtocolDataService);
  private readonly doctorAssistantService = inject(DoctorAssistantService);
  private readonly pdfService = inject(PdfService);
  protected readonly appointmentProcedureStatusType = AppointmentProcedureStatusType;
  appointment = input.required<Appointment>();

  appointmentProcedures = this.appointmentProcedureService.appointmentProcedures;
  protocol = this.protocolService.activeProtocol;
  protocolData = this.protocolDataService.protocolData;
  doctorAssistants = this.doctorAssistantService.doctorAssistants;
  activeTab = signal<AppointmentProcedure>({} as AppointmentProcedure);
  loading = signal(false);
  isEdit = signal(false);
  lang = signal('ru');

  canEdit = computed(() =>
    differenceInHours(new Date(), new Date(this.protocolData()!.createdAt)) <= 24
  );

  ngOnInit() {
    if (this.appointmentProcedures() && this.appointmentProcedures()!.length > 0) {
      this.selectTab(this.appointmentProcedures()![0]);
    }
  }

  ngOnDestroy() {
    this.protocolService.clearState();
    this.protocolDataService.clearState();
  }

  selectTab(ap: AppointmentProcedure) {
    if (this.activeTab() === ap) return;

    this.protocolService.clearState();
    this.protocolDataService.clearProtocolData();

    this.activeTab.set(ap);
    this.getProtocolForm(ap.procedure.id);

    if (ap.status === AppointmentProcedureStatusType.COMPLETED) {
      this.getProtocolData(ap.procedure.id);
    }
  }

  closeAppointmentProcedure() {
    this.appointmentProcedureService.closeAppointmentProcedure(this.activeTab().id)
      .pipe(switchMap(() => this.appointmentProcedureService.getAppointmentProcedures(this.appointment().id)))
      .subscribe(() => this.selectLastTab())
  }

  save(req: CreateProtocolDataRequest) {
    this.loading.set(true);

    req.appointmentId = this.appointment().id;
    this.protocolDataService.saveProcedureProtocolData(req)
      .pipe(
        switchMap(() => this.appointmentProcedureService.getAppointmentProcedures(this.appointment().id)),
        finalize(() => this.loading.set(false))
      )
      .subscribe(() => {
        this.protocolService.clearState();
        this.selectLastTab();
        this.getProtocolData(this.activeTab().procedure.id);
      })
  }

  edit(req: UpdateProtocolDataRequest) {
    this.loading.set(true);

    this.protocolDataService.updateProcedureProtocolData(this.protocolData()!.id, req)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe(() => {
        this.isEdit.set(false);
        this.getProtocolData(this.activeTab().procedure.id);
      })
  }

  downloadPdf() {
    this.loading.set(true);

    this.pdfService.downloadPdf(
      ProtocolTargetType.PROCEDURE,
      this.protocolData()!.id,
      this.lang(),
    )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe()
  }

  private getProtocolForm(procedureId: string) {
    this.loading.set(true);

    this.protocolService.getActiveProtocol(ProtocolTargetType.PROCEDURE, procedureId, this.appointment().patient.gender)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe();
  }

  private getProtocolData(procedureId: string) {
    this.loading.set(true);

    this.protocolDataService.getProtocolData(
      ProtocolTargetType.PROCEDURE,
      procedureId,
      this.appointment().id
    )
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe();
  }

  private selectLastTab() {
    const appointmentProcedures = this.appointmentProcedureService.appointmentProcedures();
    const lastIndex = appointmentProcedures!.length - 1;
    this.selectTab(appointmentProcedures![lastIndex]);
  }
}
