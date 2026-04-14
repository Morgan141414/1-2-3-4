import {Component, inject, input, OnInit, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {ScheduleService} from '../../../core/services/schedule.service';
import {CreateWorkScheduleExceptionRequest, WorkScheduleException} from '../../../core/model/schedule.model';
import {DateInputFieldComponent} from '../../../shared/components/date-input-field/date-input-field.component';
import {LeadingZerosPipe} from '../../../shared/pipes/leading-zeros.pipe';

@Component({
  selector: 'app-doctor-vacation-list',
  imports: [
    DateInputFieldComponent,
    ReactiveFormsModule,
    LeadingZerosPipe,
    DatePipe
  ],
  templateUrl: './doctor-vacation-list.component.html',
  styleUrl: './doctor-vacation-list.component.scss',
  standalone: true
})
export class DoctorVacationListComponent implements OnInit {
  private readonly scheduleService = inject(ScheduleService);
  orgUserId = input.required<string>();

  vacations = signal<WorkScheduleException[]>([]);
  form = new FormGroup({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    note: new FormControl('')
  })

  ngOnInit() {
    this.getVacations();
  }

  createVacation() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = {
      orgUserId: this.orgUserId(),
      ...this.form.value!
    }

    this.scheduleService.createScheduleException(request as CreateWorkScheduleExceptionRequest)
      .subscribe(_ => {
        this.form.reset();
        this.getVacations();
      });
  }

  private getVacations() {
    this.scheduleService.getScheduleExceptions(this.orgUserId())
      .subscribe(resp => this.vacations.set(resp));
  }

}
