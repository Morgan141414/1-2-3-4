import {Component, computed, effect, inject, OnDestroy, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {
  CalendarCommonModule,
  CalendarDayModule, CalendarEvent,
  CalendarView,
  CalendarWeekModule,
  DAYS_OF_WEEK
} from 'angular-calendar';
import {format, getWeek} from 'date-fns';

import {CalendarService} from '../../../core/services/calendar.service';
import {ScheduleService} from '../../../core/services/schedule.service';
import {PatientDocumentVerificationStatus} from '../../../core/model/patient.model';
import {CalendarDoctorFilterComponent} from '../calendar-doctor-filter/calendar-doctor-filter.component';
import {
  CalendarActionButtonsComponent
} from '../../../shared/components/calendar-action-buttons/calendar-action-buttons.component';

@Component({
  selector: 'app-events-calendar',
  imports: [
    CalendarWeekModule,
    CalendarDayModule,
    CalendarCommonModule,
    FormsModule,
    CalendarDoctorFilterComponent,
    CalendarActionButtonsComponent,
    NgClass
  ],
  templateUrl: './events-calendar.component.html',
  styleUrl: './events-calendar.component.scss',
  standalone: true
})
export class EventsCalendarComponent implements OnDestroy {
  private readonly calendarService = inject(CalendarService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly router = inject(Router);
  protected readonly CalendarView = CalendarView;
  protected readonly DAYS_OF_WEEK = DAYS_OF_WEEK;
  protected readonly patientDocumentVerificationStatus = PatientDocumentVerificationStatus;

  events = computed(() => {
    return [...this.calendarService.events(), ...this.scheduleService.disabledSlots()]
  });
  viewDate = this.calendarService.viewDate;
  doctorSpecialization = this.calendarService.doctorSpecialization;
  view = signal<CalendarView>(CalendarView.Week);
  weekNumber = signal(getWeek(this.viewDate(), { weekStartsOn: 1 }));

  constructor() {
    effect(() => {
      const newWeekNumber = getWeek(this.viewDate(), { weekStartsOn: 1 });
      if (this.weekNumber() != newWeekNumber) {
        this.weekNumber.set(newWeekNumber);
        this.calendarService.getCalendarEvents()
          .subscribe();
        this.scheduleService.getScheduleSlots(this.viewDate(), this.doctorSpecialization()?.doctor?.orgUserId)
          .subscribe();
      }
    });
  }

  ngOnDestroy() {
    this.calendarService.clearState();
    this.scheduleService.clearState();
  }

  changeDay(date: Date) {
    this.viewDate.set(date);
    this.setView(CalendarView.Day);
  }

  setView(view: CalendarView) {
    this.view.set(view);
  }

  onHourSegmentClicked(date: Date) {
    if (!this.doctorSpecialization()) {
      return;
    }
    this.calendarService.datetime.set(format(date, "yyyy-MM-dd'T'HH:mm"));
    this.router.navigate([{ outlets: { panel: ['panels', 'calendar-event', 'new'] } }]);
  }

  onEventClicked(event: CalendarEvent) {
    if (event.meta.disabled) {
      return;
    }

    this.router.navigate([{ outlets: { panel: ['panels', 'calendar-event', event.id] } }]);
  }

}
