import {ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatInput} from '@angular/material/input';
import {MatTimepicker, MatTimepickerInput} from '@angular/material/timepicker';
import {NgxMaskDirective} from 'ngx-mask';
import {distinctUntilChanged, finalize, switchMap} from 'rxjs';
import {addMinutes, format, isSameDay} from 'date-fns';

import {PatientService} from '../../../core/services/patient.service';
import {DoctorProcedureService} from '../../../core/services/doctor-procedure.service';
import {PanelService} from '../../../core/services/panel.service';
import {CalendarService} from '../../../core/services/calendar.service';
import {AppointmentService} from '../../../core/services/appointment.service';
import {RoomService} from '../../../core/services/room.service';
import {ScheduleService} from '../../../core/services/schedule.service';
import {TrafficSourceType} from '../../../core/model/analytics.model';
import {DoctorProcedure} from '../../../core/model/doctor-procedure.model';
import {AddAppointmentProcedureRequest} from '../../../core/model/appointment-procedure.model';
import {
  ClientOwnershipType,
  CreateAppointmentRequest,
} from '../../../core/model/appointment.model';
import {Room} from '../../../core/model/room.model';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';
import {getFullname, getTrafficSourceTypeName} from '../../../shared/utils/name.util';

enum AppointmentPatientMode {
  REGISTERED = 'REGISTERED',
  TEMPORARY = 'TEMPORARY',
}

@Component({
  selector: 'app-create-calendar-event-panel',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    MatSelect,
    MatOption,
    NgClass,
    DatePipe,
    MatInput,
    MatTimepickerInput,
    MatTimepicker,
    PhoneInputFieldComponent
  ],
  templateUrl: './create-calendar-event-panel.component.html',
  styleUrl: './create-calendar-event-panel.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCalendarEventPanelComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly calendarService = inject(CalendarService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly patientService = inject(PatientService);
  private readonly doctorProcedureService = inject(DoctorProcedureService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly roomService = inject(RoomService);
  private readonly panelService = inject(PanelService);
  protected readonly clientOwnershipType = ClientOwnershipType;
  protected readonly trafficSourceTypes = Object.values(TrafficSourceType);
  protected readonly appointmentPatientMode = AppointmentPatientMode;
  protected readonly getFullname = getFullname;
  protected readonly getTrafficSourceTypeName = getTrafficSourceTypeName;

  patients = this.patientService.patients;
  specializationId = this.calendarService.specializationId;
  doctorSpecialization = this.calendarService.doctorSpecialization;
  datetime = this.calendarService.datetime;
  search = this.patientService.search;
  doctorProcedures = signal<DoctorProcedure[]>([]);
  selectedProcedure = signal<DoctorProcedure | null>(null);
  appointmentProcedures = signal<AddAppointmentProcedureRequest[]>([]);
  isFirstEntry = signal(false);
  isProceduresEmpty = signal(false);
  rooms = signal<Room[]>([]);
  minTime = signal('');
  maxTime = signal('21:00');
  patientMode = signal<AppointmentPatientMode>(AppointmentPatientMode.REGISTERED);
  form = new FormGroup({
    patientId: new FormControl('', Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
    trafficSource: new FormControl<TrafficSourceType | null>(null),
    roomId: new FormControl(''),
    clientOwnershipType: new FormControl(ClientOwnershipType.CLINIC, Validators.required),
    tempPatientName: new FormControl<string | null>(null),
    tempPatientPhone: new FormControl<string | null>(null),
  });

  events = computed(() => {
    return [...this.calendarService.events(), ...this.scheduleService.disabledSlots()]
  });

  constructor() {
    effect(() => {
      const start = this.calendarService.datetime();
      const end = addMinutes(new Date(start), 10);
      this.form.controls.end.setValue(end, { emitEvent: false });

      this.minTime.set(format(addMinutes(start, 10), 'HH:mm'));

      const selectedDayEvents = this.events()
        .filter(e => isSameDay(e.start, start))
        .sort((a, b) => a.start.getTime() - b.start.getTime());
      const nextEvent = selectedDayEvents
        .find(e => e.start > new Date(start));
      this.maxTime.set(nextEvent ? format(nextEvent.start, 'HH:mm') : '21:00');
    });
  }

  ngOnInit() {
    this.getPatients();
    this.getProcedures();

    this.form.controls.end.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => this.getRoomsByProcedures());
  }

  ngOnDestroy() {
    this.patientService.clearState();
  }

  onPatientModeChange() {
    if (this.patientMode() === AppointmentPatientMode.REGISTERED) {
      this.enableRegisteredPatient();
    } else {
      this.enableTemporaryPatient();
    }
  }

  checkForFirstEntry() {
    const patientId= this.form.controls.patientId.value;
    if (patientId) {
      this.appointmentService.checkForFirstEntry(patientId)
        .subscribe(resp => this.isFirstEntry.set(resp))
    }
  }

  isRoomRequired() {
    return this.appointmentProcedures()
      .some(ap => ap.isRoomRequired)
  }

  addProcedure() {
    if (!this.selectedProcedure()) {
      return;
    }
    this.appointmentProcedures().push({
      procedureId: this.selectedProcedure()!.orgProcedure.procedure.id,
      actualPrice: this.selectedProcedure()!.price,
      procedureName: this.selectedProcedure()!.orgProcedure.procedure.name,
      isRoomRequired: this.selectedProcedure()!.orgProcedure.roomRequired
    });
    this.selectedProcedure.set(null);
    this.isProceduresEmpty.set(false);

    this.getRoomsByProcedures();
  }

  removeProcedure(index: number) {
    this.appointmentProcedures().splice(index, 1);
    if (this.appointmentProcedures().length < 1) {
      this.isProceduresEmpty.set(true);
    }

    this.form.controls.roomId.setValue('');

    this.getRoomsByProcedures();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.appointmentProcedures().length < 1) {
      this.isProceduresEmpty.set(true);
      return;
    }
    this.form.disable();

    this.appointmentService.createAppointment(
      {
        orgUserId: this.doctorSpecialization()!.doctor!.orgUserId,
        patientId: this.form.controls.patientId.value,
        specializationId: this.specializationId(),
        doctorId: this.doctorSpecialization()!.doctor!.id,
        datetime: this.datetime(),
        endDatetime: format(this.form.controls.end.value!, "yyyy-MM-dd'T'HH:mm"),
        trafficSource: this.form.controls.trafficSource.value,
        roomId: this.form.controls.roomId.value,
        procedures: this.appointmentProcedures(),
        clientOwnershipType: this.form.controls.clientOwnershipType.value,
        tempPatientName: this.form.controls.tempPatientName.value,
        tempPatientPhone: this.form.controls.tempPatientPhone.value,
      } as CreateAppointmentRequest)
      .pipe(
        switchMap(() => this.calendarService.getCalendarEvents()),
        finalize(() => {
          this.form.enable();
        })
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Пациент успешно записан!', '', { panelClass: 'snackbar-success' });
          this.panelService.closePanel();
        },
        error: (err) => {
        if (err.status === 400) {
          this.panelService.closePanel();
          this.snackBar.open('Пациент успешно записан!', '', { panelClass: 'snackbar-success' })
            .afterDismissed()
            .pipe(
              switchMap(() => this.calendarService.getCalendarEvents())
            )
            .subscribe(_ =>
              this.snackBar.open(
                err.error?.detail,
                '',
                { duration: 4000, panelClass: 'snackbar-warning' }
              )
            );
          }
        }
      })
  }

  getPatients() {
    this.patientService.getPatients({ size: 100 })
      .subscribe()
  }

  openAddPatientPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'patients', 'new'] } }]);
  }

  private getProcedures() {
    if (this.doctorSpecialization()?.id && this.specializationId()) {
      this.doctorProcedureService.getDoctorProceduresByDocSpecId(this.doctorSpecialization()!.id)
        .subscribe(resp => {
          this.doctorProcedures.set(resp);
          this.appointmentProcedures.set([]);
        });
    }
  }

  private getRoomsByProcedures() {
    if (this.isRoomRequired()) {
      this.form.controls.roomId.setValue('');
      this.form.controls.roomId.addValidators(Validators.required);

      const ids = this.appointmentProcedures()
        .map(ap => ap.procedureId);
      const start = this.datetime();
      const end = format(this.form.controls.end.value!, "yyyy-MM-dd'T'HH:mm");

      this.roomService.getRoomsByProcedures(ids, start, end)
        .subscribe(resp => {
          this.rooms.set(resp);
          if (resp.length > 0) {
            this.form.controls.roomId.setValue(resp[0].id);
          }
        });
    } else {
      this.form.controls.roomId.clearValidators();
      this.rooms.set([]);
    }

    this.form.controls.roomId.updateValueAndValidity();
  }

  private enableRegisteredPatient() {
    this.form.controls.patientId.setValidators(Validators.required);
    this.form.controls.patientId.enable();

    this.form.controls.tempPatientName.clearValidators();
    this.form.controls.tempPatientPhone.clearValidators();

    this.form.controls.tempPatientName.disable();
    this.form.controls.tempPatientPhone.disable();

    this.form.controls.tempPatientName.reset();
    this.form.controls.tempPatientPhone.reset();

    this.form.controls.patientId.updateValueAndValidity();
  }

  private enableTemporaryPatient() {
    this.form.controls.patientId.clearValidators();
    this.form.controls.patientId.disable();
    this.form.controls.patientId.reset();

    this.form.controls.tempPatientName.setValidators(Validators.required);
    this.form.controls.tempPatientPhone.setValidators(Validators.required);

    this.form.controls.tempPatientName.enable();
    this.form.controls.tempPatientPhone.enable();

    this.form.controls.tempPatientName.updateValueAndValidity();
    this.form.controls.tempPatientPhone.updateValueAndValidity();

  }

}
