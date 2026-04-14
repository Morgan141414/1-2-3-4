import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {forkJoin, switchMap, tap} from 'rxjs';

import {AppointmentService} from '../../../core/services/appointment.service';
import {AppointmentProcedureService} from '../../../core/services/appointment-procedure.service';
import {DoctorAssistantService} from '../../../core/services/doctor-assistant.service';
import {DoctorProcedureService} from '../../../core/services/doctor-procedure.service';
import {AppointmentStatusType} from '../../../core/model/appointment.model';
import {
  AppointmentDetailsHeaderComponent
} from '../../appointments/appointment-details-header/appointment-details-header.component';
import {ITab, TabsComponent} from '../../../shared/components/tabs/tabs.component';
import {
  AppointmentDetailsDocumentsComponent
} from '../../appointments/appointment-details-documents/appointment-details-documents.component';
import {
  AppointmentDetailsProceduresComponent
} from '../../appointments/appointment-details-procedures/appointment-details-procedures.component';

@Component({
  selector: 'app-appointment-details-page',
  imports: [
    AppointmentDetailsHeaderComponent,
    TabsComponent,
    AppointmentDetailsDocumentsComponent,
    AppointmentDetailsProceduresComponent,
  ],
  templateUrl: './appointment-details-page.component.html',
  styleUrl: './appointment-details-page.component.scss',
  standalone: true
})
export class AppointmentDetailsPageComponent implements OnInit, OnDestroy {
  private readonly appointmentService = inject(AppointmentService);
  private readonly appointmentProcedureService = inject(AppointmentProcedureService);
  private readonly doctorAssistantService = inject(DoctorAssistantService);
  private readonly doctorProcedureService = inject(DoctorProcedureService);
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
  appointment = this.appointmentService.appointmentDetails;
  appointmentProcedures = this.appointmentProcedureService.appointmentProcedures;

  ngOnInit() {
    this.getAppointment();
    this.getAppointmentProcedures();
  }

  ngOnDestroy() {
    this.appointmentProcedureService.clearState();
    this.doctorAssistantService.clearState();
    this.appointmentService.clearAppointmentDetails();
    this.doctorProcedureService.cleatState();
  }

  selectTab(id: string) {
    this.activeTab.set(id);
  }

  private getAppointment() {
    this.appointmentService.getAppointment(this.id())
      .pipe(
        tap(resp => {
          if (resp.status === AppointmentStatusType.COMPLETED && resp.comment) this.addCommentTab();
        }),
        switchMap(resp =>
          forkJoin([
            this.doctorAssistantService.getDoctorAssistants(resp.doctor.orgUserId!),
            this.doctorProcedureService.getDoctorProceduresByDoctorIdAndSpecId(resp.doctor.id, resp.specializationId)
          ])
        )
      )
      .subscribe();
  }

  private getAppointmentProcedures() {
    this.appointmentProcedureService.getAppointmentProcedures(this.id())
      .subscribe();
  }

  private addCommentTab() {
    this.tabs.push({
      id: 'comment',
      title: 'Комментарий'
    })
  }
}
