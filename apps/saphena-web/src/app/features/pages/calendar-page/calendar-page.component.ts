import {Component, inject} from '@angular/core';

import {AuthService} from '../../../core/services/auth.service';
import {UserRoleType} from '../../../core/model/user.model';
import {DoctorEventsCalendarComponent} from '../../calendar/doctor-events-calendar/doctor-events-calendar.component';
import {EventsCalendarComponent} from '../../calendar/events-calendar/events-calendar.component';

@Component({
  selector: 'app-calendar-page',
  imports: [
    DoctorEventsCalendarComponent,
    EventsCalendarComponent
  ],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss',
  standalone: true
})
export class CalendarPageComponent {
  private readonly authService = inject(AuthService);
  protected readonly userRoleType = UserRoleType;
  role = this.authService.getRole();

}
