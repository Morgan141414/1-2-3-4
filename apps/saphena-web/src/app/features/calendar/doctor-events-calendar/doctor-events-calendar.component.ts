import {Component, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CalendarDayModule, CalendarEvent, CalendarView, CalendarWeekModule, DAYS_OF_WEEK} from 'angular-calendar';
import {getWeek} from 'date-fns';

import {CalendarService} from '../../../core/services/calendar.service';
import {
  CalendarActionButtonsComponent
} from '../../../shared/components/calendar-action-buttons/calendar-action-buttons.component';
import {AppointmentStatusType} from '../../../core/model/appointment.model';
import {NgClass} from '@angular/common';
import {CalendarEventMetaData} from '../../../core/model/calendar.model';
import {VerifyPatientDialogComponent} from '../../patients/verify-patient-dialog/verify-patient-dialog.component';
import {PatientDocumentVerificationStatus} from '../../../core/model/patient.model';

@Component({
  selector: 'app-doctor-events-calendar',
  imports: [
    CalendarActionButtonsComponent,
    CalendarDayModule,
    CalendarWeekModule,
    NgClass
  ],
  templateUrl: './doctor-events-calendar.component.html',
  styleUrl: './doctor-events-calendar.component.scss',
  standalone: true
})
export class DoctorEventsCalendarComponent implements OnDestroy, OnInit {
  private readonly router = inject(Router);
  private readonly calendarService = inject(CalendarService);
  private readonly dialog = inject(MatDialog);
  protected readonly CalendarView = CalendarView;
  protected readonly DAYS_OF_WEEK = DAYS_OF_WEEK;
  protected readonly patientDocumentVerificationStatus = PatientDocumentVerificationStatus;

  events = this.calendarService.events;
  viewDate = this.calendarService.viewDate;
  view = signal<CalendarView>(CalendarView.Week);
  weekNumber = signal(getWeek(this.viewDate(), { weekStartsOn: 1 }));

  constructor() {
    effect(() => {
      const newWeekNumber = getWeek(this.viewDate(), { weekStartsOn: 1 });
      if (this.weekNumber() != newWeekNumber) {
        this.weekNumber.set(newWeekNumber);
        this.calendarService.getDoctorCalendarEvents()
          .subscribe();
      }
    });
  }

  ngOnInit() {
    this.getEvents();
  }

  ngOnDestroy() {
    this.calendarService.clearState();
  }

  changeDay(date: Date) {
    this.viewDate.set(date);
    this.setView(CalendarView.Day);
  }

  setView(view: CalendarView) {
    this.view.set(view);
  }

  onEventClicked(event: CalendarEvent<CalendarEventMetaData>) {
    if (!event.meta!.patientId) {
      this.router.navigate([{ outlets: { panel: ['panels', 'attach-patient', event.id] } }]);
      return;
    }

    if (event.meta!.verificationStatus === PatientDocumentVerificationStatus.PROVIDED) {
      const dialogRef = this.dialog.open(VerifyPatientDialogComponent, {
        data: event.meta?.patientId
      });

      dialogRef.afterClosed()
        .subscribe(result => {
          if (result === true) {
            this.getEvents();
          }
        });
      return;
    }
    if (event.meta!.status !== AppointmentStatusType.CANCELLED) {
      this.router.navigate([`/appointments/${event.id}`]);
    }
  }

  private getEvents() {
    this.calendarService.getDoctorCalendarEvents()
      .subscribe();
  }

}
