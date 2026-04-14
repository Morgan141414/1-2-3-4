import {Component, inject, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {PanelService} from '../../../core/services/panel.service';
import {CalendarService} from '../../../core/services/calendar.service';
import {OrganizationProcedureService} from '../../../core/services/organization-procedure.service';
import {ScheduleService} from '../../../core/services/schedule.service';
import {DoctorSpecializationService} from '../../../core/services/doctor-specialization.service';
import {Specialization} from '../../../core/model/specialization.model';
import {DoctorSpecialization} from '../../../core/model/doctor-specialization.model';
import {getFullname} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-calendar-doctor-filter',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './calendar-doctor-filter.component.html',
  styleUrl: './calendar-doctor-filter.component.scss',
  standalone: true
})
export class CalendarDoctorFilterComponent implements OnInit {
  private readonly calendarService = inject(CalendarService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly orgProcedureService = inject(OrganizationProcedureService);
  private readonly doctorSpecializationService = inject(DoctorSpecializationService);
  private readonly panelService = inject(PanelService);
  protected readonly getFullname = getFullname;

  selectedSpecializationId = this.calendarService.specializationId;
  selectedDoctorSpecialization = this.calendarService.doctorSpecialization;
  viewDate = this.calendarService.viewDate;
  specializations = signal<Specialization[]>([]);
  doctorSpecializations = signal<DoctorSpecialization[]>([]);

  ngOnInit() {
    this.getSpecializations();
  }

  onSpecializationChange() {
    this.panelService.closePanel();
    this.selectedDoctorSpecialization.set(null);
    this.calendarService.events.set([]);
    this.scheduleService.disabledSlots.set([]);

    if (!!this.selectedSpecializationId()) {
      this.doctorSpecializationService.getDoctorSpecializationsBySpecId(this.selectedSpecializationId())
        .subscribe(resp => {
          this.doctorSpecializations.set(resp);
        });
    }
  }

  onDoctorChange() {
    this.panelService.closePanel();
    this.calendarService.getCalendarEvents()
      .subscribe();
    this.scheduleService.getScheduleSlots(this.viewDate(), this.selectedDoctorSpecialization()?.doctor?.orgUserId)
      .subscribe();
  }

  private getSpecializations() {
    this.orgProcedureService.getSpecializations()
      .subscribe(resp => this.specializations.set(resp));
  }
}
