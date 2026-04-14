import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppointmentService} from '../../../core/services/appointment.service';
import {AuthService} from '../../../core/services/auth.service';
import {AppointmentStatusType} from '../../../core/model/appointment.model';
import {UserRoleType} from '../../../core/model/user.model';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';
import {AppointmentTableComponent} from '../../appointments/appointment-table/appointment-table.component';
import {getAppointmentStatusName} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-appointment-list-page',
  imports: [
    FormsModule,
    PaginationComponent,
    AppointmentTableComponent
  ],
  templateUrl: './appointment-list-page.component.html',
  styleUrl: './appointment-list-page.component.scss',
  standalone: true
})
export class AppointmentListPageComponent implements OnInit, OnDestroy {
  private readonly appointmentService = inject(AppointmentService);
  private readonly authService = inject(AuthService);
  protected readonly role = this.authService.getRole();
  protected readonly UserRoleType = UserRoleType;
  protected readonly appointmentStatusTypes = Object.values(AppointmentStatusType);
  protected readonly getAppointmentStatusName = getAppointmentStatusName;

  appointments = this.appointmentService.appointments;
  filter = this.appointmentService.filter;

  ngOnInit() {
    this.getAppointments();
  }

  ngOnDestroy() {
    this.appointmentService.cleatState();
  }

  getAppointments(page?: number) {
    if (this.role === UserRoleType.ROLE_PATIENT) {
      this.appointmentService.getPatientAppointments({ page })
        .subscribe();
    } else {
      this.appointmentService.getAppointments({ page })
        .subscribe();
    }
  }

}
