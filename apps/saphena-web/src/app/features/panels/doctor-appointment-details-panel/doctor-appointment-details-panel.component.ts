import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgxMaskPipe} from 'ngx-mask';
import {map, switchMap} from 'rxjs';

import {AppointmentService} from '../../../core/services/appointment.service';
import {CalendarService} from '../../../core/services/calendar.service';
import {PatientService} from '../../../core/services/patient.service';
import {PanelService} from '../../../core/services/panel.service';
import {Appointment, AppointmentStatusType} from '../../../core/model/appointment.model';
import {getFullname} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-doctor-appointment-details-panel',
  imports: [
    FormsModule,
    MatOption,
    MatSelect,
    NgxMaskPipe,
    ReactiveFormsModule
  ],
  templateUrl: './doctor-appointment-details-panel.component.html',
  styleUrl: './doctor-appointment-details-panel.component.scss',
  standalone: true
})
export class DoctorAppointmentDetailsPanelComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly appointmentService = inject(AppointmentService);
  private readonly calendarService = inject(CalendarService);
  private readonly patientService = inject(PatientService);
  private readonly panelService = inject(PanelService);
  protected readonly getFullname = getFullname;
  id = input.required<string>();

  patients = this.patientService.patients;
  search = this.patientService.search;
  appointment = signal<Appointment>({} as Appointment);
  patientIdControl = new FormControl('', Validators.required);

  get hasTemporaryPatient(): boolean {
    const a = this.appointment();
    return !a.patient && !!a.tempPatientName && !!a.tempPatientPhone;
  }

  get canAttachPatient(): boolean {
    return (
      this.hasTemporaryPatient &&
      this.appointment().status === AppointmentStatusType.SCHEDULED
    );
  }

  ngOnInit() {
    this.getAppointment();
  }

  ngOnDestroy() {
    this.patientService.clearState();
  }

  attachPatient() {
    if (this.patientIdControl.invalid) {
      this.patientIdControl.markAsTouched();
      return;
    }

    this.patientIdControl.disable();

    this.appointmentService.attachPatient(this.id(), this.patientIdControl.value!)
      .subscribe(_ => {
        this.getAppointments();
        this.panelService.closePanel();
      })
  }

  openAddPatientPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'patients', 'new'] } }]);
  }

  getPatients() {
    this.patientService.getPatients({ size: 100 })
      .subscribe()
  }

  private getAppointment() {
    this.route.params
      .pipe(
        map(params => params["id"]),
        switchMap(id => this.appointmentService.getAppointment(id))
      )
      .subscribe(resp => this.appointment.set(resp));
  }

  private getAppointments() {
    if (this.router.url.includes('calendar')) {
      this.calendarService.getDoctorCalendarEvents()
        .subscribe();
    } else {
      this.appointmentService.getAppointments()
        .subscribe();
    }
  }

}
