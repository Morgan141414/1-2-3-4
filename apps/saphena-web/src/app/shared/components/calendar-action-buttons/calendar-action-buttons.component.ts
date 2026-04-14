import {Component, inject, input, output, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {CalendarCommonModule, CalendarView} from 'angular-calendar';

import {CalendarService} from '../../../core/services/calendar.service';

@Component({
  selector: 'app-calendar-action-buttons',
  imports: [
    CalendarCommonModule,
    NgClass
  ],
  templateUrl: './calendar-action-buttons.component.html',
  styleUrl: './calendar-action-buttons.component.scss',
  standalone: true
})
export class CalendarActionButtonsComponent {
  private readonly calendarService = inject(CalendarService);
  protected readonly CalendarView = CalendarView;
  view = input.required<CalendarView>();
  showViewTypeButtons = input(false);
  viewTypeButtonClicked = output<CalendarView>();

  viewDate = this.calendarService.viewDate;
}
