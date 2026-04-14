import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CalendarEvent} from 'angular-calendar';
import {of, tap} from 'rxjs';
import {endOfWeek, format, startOfWeek} from 'date-fns';

import {
  CreateWorkScheduleExceptionRequest,
  CreateWorkScheduleRequest, generateWeekBlockedEvents, UpdateWorkScheduleRequest,
  WorkSchedule,
  WorkScheduleException, WorkScheduleSlot
} from '../model/schedule.model';
import {CalendarEventMetaData} from '../model/calendar.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private readonly http = inject(HttpClient);

  disabledSlots = signal<CalendarEvent<CalendarEventMetaData>[]>([]);

  getWorkSchedules(orgUserId: string, includePatterns = false) {
    return this.http.get<WorkSchedule[]>(`/api/schedules?orgUserId=${orgUserId}&includePatterns=${includePatterns}`);
  }

  createWorkSchedule(request: CreateWorkScheduleRequest) {
    return this.http.post<WorkSchedule>(`/api/schedules`, request);
  }

  updateWorkSchedule(request: UpdateWorkScheduleRequest) {
    return this.http.put<WorkSchedule>(`/api/schedules`, request);
  }

  deleteSchedule(id: string) {
    return this.http.delete<void>(`/api/schedules/${id}`);
  }

  getScheduleExceptions(orgUserId: string) {
    return this.http.get<WorkScheduleException[]>(`/api/schedules/exceptions?orgUserId=${orgUserId}`);
  }

  createScheduleException(request: CreateWorkScheduleExceptionRequest) {
    return this.http.post<WorkScheduleException[]>(`/api/schedules/exceptions`, request);
  }

  getScheduleSlots(date: Date, orgUserId?: string) {
    if (!orgUserId) {
      return of([]);
    }

    const from = format(
      startOfWeek(date, { weekStartsOn: 1 }),
      'yyyy-MM-dd'
    );
    const to = format(
      endOfWeek(date, { weekStartsOn: 1 }),
      'yyyy-MM-dd'
    );

    return this.http.get<WorkScheduleSlot[]>(`/api/schedules/availability`, {
      params: {
        orgUserId,
        from,
        to
      }
    }).pipe(
      tap(resp => this.disabledSlots.set(generateWeekBlockedEvents(resp, date)))
    );
  }

  clearState() {
    this.disabledSlots.set([]);
  }
}
