import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of, tap} from 'rxjs';
import {CalendarEvent} from 'angular-calendar';
import {endOfWeek, format, startOfWeek} from 'date-fns';

import {CalendarEventMetaData, mapToCalendarEvents} from '../model/calendar.model';
import {DoctorSpecialization} from '../model/doctor-specialization.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private readonly http = inject(HttpClient);

  events = signal<CalendarEvent<CalendarEventMetaData>[]>([]);
  viewDate = signal<Date>(new Date());
  specializationId = signal<string>('');
  doctorSpecialization = signal<DoctorSpecialization | null>(null);
  datetime = signal('');

  getCalendarEvents() {
    if (!this.specializationId() || !this.doctorSpecialization()?.doctor) {
      return of([]);
    }

    const start = format(
      startOfWeek(this.viewDate(), { weekStartsOn: 1 }),
      'yyyy-MM-dd'
    );
    const end = format(
      endOfWeek(this.viewDate(), { weekStartsOn: 1 }),
      'yyyy-MM-dd'
    );

    return this.http.get<CalendarEvent<CalendarEventMetaData>[]>(`/api/calendar`, {
      params: {
        specializationId: this.specializationId(),
        doctorId: this.doctorSpecialization()!.doctor!.id,
        start,
        end
      }
    }).pipe(
        tap(resp => this.events.set(mapToCalendarEvents(resp)))
      );
  }

  getDoctorCalendarEvents() {
    const start = format(
      startOfWeek(this.viewDate(), { weekStartsOn: 1 }),
      'yyyy-MM-dd'
    );
    const end = format(
      endOfWeek(this.viewDate(), { weekStartsOn: 1 }),
      'yyyy-MM-dd'
    );

    return this.http.get<CalendarEvent<CalendarEventMetaData>[]>(`/api/calendar/doctor`, {
      params: {
        start,
        end
      }
    }).pipe(
      tap(resp => this.events.set(mapToCalendarEvents(resp)))
    );
  }

  clearState() {
    this.events.set([]);
    this.viewDate.set(new Date());
    this.specializationId.set('');
    this.doctorSpecialization.set(null);
    this.datetime.set('');
  }

}
