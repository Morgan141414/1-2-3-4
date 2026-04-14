import {Component, inject, input, OnInit, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  CalendarDayModule,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarWeekModule,
  DAYS_OF_WEEK
} from 'angular-calendar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {addMinutes, format} from 'date-fns';

import {ScheduleService} from '../../../core/services/schedule.service';
import {
  CreateWorkScheduleRequest,
  mapEventsToWorkPatterns, mapWorkPatternsToEvents, UpdateWorkScheduleRequest,
  WorkSchedule
} from '../../../core/model/schedule.model';
import {EVENT_COLORS} from '../../../core/model/calendar.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {DateInputFieldComponent} from '../../../shared/components/date-input-field/date-input-field.component';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-doctor-schedule',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputFieldComponent,
    DateInputFieldComponent,
    CalendarWeekModule,
    CalendarDayModule,
    DatePipe
  ],
  templateUrl: './doctor-schedule.component.html',
  styleUrl: './doctor-schedule.component.scss',
  standalone: true
})
export class DoctorScheduleComponent implements OnInit {
  private readonly scheduleService = inject(ScheduleService);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  protected readonly DAYS_OF_WEEK = DAYS_OF_WEEK;
  orgUserId = input.required<string>();
  date = new Date();

  isFormVisible = signal(false);
  isEdit = signal(false);
  schedules = signal<WorkSchedule[]>([]);
  selectedSchedule = signal<WorkSchedule | null>(null);
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('')
  })
  events = signal<CalendarEvent[]>([]);

  ngOnInit() {
    this.getWorkSchedules();
  }

  updateEvents() {
    this.events.set(
      mapWorkPatternsToEvents(this.selectedSchedule()?.patterns ?? [], this.date)
    )
  }

  showForm() {
    this.isFormVisible.set(true);
    this.events.set([]);
  }

  editWorkSchedule() {
    this.form.controls.name.setValue(this.selectedSchedule()!.name);
    this.form.controls.startDate.setValue(this.selectedSchedule()!.startDate);
    this.form.controls.endDate.setValue(this.selectedSchedule()!.endDate);

    this.events.update(events => {
      return events.map(e => ({
        ...e,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        actions: [
          {
            label: '<i class="fas fa-fw fa-trash-alt text-red-500"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.events.set(this.events().filter((iEvent) => iEvent !== event));
            },
          },
        ]
      }))
    })

    this.isEdit.set(true);
    this.isFormVisible.set(true);
  }

  onHourSegmentClicked(date: Date) {
    if (!this.isFormVisible()) {
      return;
    }

    const weekDay = format(date, 'EEEE').toUpperCase();

    this.events.set([
      ...this.events(),
      {
        title: weekDay,
        color: EVENT_COLORS['blue'],
        start: date,
        end: addMinutes(date, 30),
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        actions: [
          {
            label: '<i class="fas fa-fw fa-trash-alt text-red-500"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.events.set(this.events().filter((iEvent) => iEvent !== event));
            },
          },
        ]
      }
    ]);
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent) {
    this.events.update(events =>
      events.map(ev =>
        ev === event ? { ...event, start: newStart, end: newEnd } : ev
      )
    );
  }

  createSchedule() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: CreateWorkScheduleRequest = {
      orgUserId: this.orgUserId(),
      name: this.form.controls.name.value!,
      startDate: this.form.controls.startDate.value!,
      endDate: this.form.controls.endDate.value ?? null,
      patterns: mapEventsToWorkPatterns(this.events())
    }

    this.scheduleService.createWorkSchedule(request)
      .pipe(
        switchMap(() => this.scheduleService.getWorkSchedules(this.orgUserId(), true))
      )
      .subscribe(resp => {
        this.matSnackBar.open('График добавлен', '', {panelClass: 'snackbar-success'});
        this.schedules.set(resp);
        this.selectedSchedule.set(resp[resp.length - 1]);
        this.cancel();
      });
  }

  updateSchedule() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: UpdateWorkScheduleRequest = {
      id: this.selectedSchedule()!.id,
      name: this.form.controls.name.value!,
      startDate: this.form.controls.startDate.value!,
      endDate: this.form.controls.endDate.value ?? null,
      patterns: mapEventsToWorkPatterns(this.events())
    }

    this.scheduleService.updateWorkSchedule(request)
      .pipe(
        switchMap(() => this.scheduleService.getWorkSchedules(this.orgUserId(), true))
      )
      .subscribe(resp => {
        this.matSnackBar.open('График изменен', '', {panelClass: 'snackbar-success'});
        this.schedules.set(resp);
        this.selectedSchedule.set(resp[resp.length - 1]);
        this.cancel();
      });
  }

  cancel() {
    this.isFormVisible.set(false);
    this.isEdit.set(false);
    this.form.reset();
    this.updateEvents();
  }

  deleteWorkSchedule() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: this.selectedSchedule()!.name, subtitle: 'Вы уверены что хотите удалить график?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.scheduleService.deleteSchedule(this.selectedSchedule()!.id)
            .pipe(
              switchMap(() => this.scheduleService.getWorkSchedules(this.orgUserId(), true))
            )
            .subscribe(resp => {
                this.matSnackBar.open('График удален', '', { panelClass: 'snackbar-success' });
                this.schedules.set(resp);
                this.selectedSchedule.set(null);
                this.updateEvents();
            })
        }
      })
  }

  private getWorkSchedules() {
    this.scheduleService.getWorkSchedules(this.orgUserId(), true)
      .subscribe(resp => this.schedules.set(resp));
  }
}
