import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {Page, Pageable} from '../model/page.model';
import {Appointment, CreateAppointmentRequest, UpdatePaymentStatusRequest} from '../model/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly http = inject(HttpClient);

  #appointments = signal<Page<Appointment>>({} as Page<Appointment>);
  #appointmentDetails = signal<Appointment>({} as Appointment);

  appointments = this.#appointments.asReadonly();
  appointmentDetails = this.#appointmentDetails.asReadonly();
  filter = signal({
    search: '',
    from: '',
    to: '',
    status: ''
  });

  getAppointments(pageable?: Pageable) {
    return this.http.get<Page<Appointment>>('/api/appointments',
      { params: { ...pageable, ...this.filter() }})
      .pipe(
        tap(resp => this.#appointments.set(resp))
      );
  }

  getPatientAppointments(pageable?: Pageable) {
    return this.http.get<Page<Appointment>>('/api/appointments/patient',
      { params: { ...pageable, ...this.filter() }})
      .pipe(
        tap(resp => this.#appointments.set(resp))
      );
  }

  getAppointment(id: string) {
    return this.http.get<Appointment>(`/api/appointments/${id}`)
      .pipe(
        tap(resp => this.#appointmentDetails.set(resp))
      );
  }

  createAppointment(req: CreateAppointmentRequest) {
    return this.http.post<void>('/api/appointments', req);
  }

  rescheduleAppointment(id: string,
                        datetime: string,
                        endDatetime: string) {
    return this.http.post<void>(`/api/appointments/${id}/reschedule?datetime=${datetime}&end-datetime=${endDatetime}`, null);
  }

  cancelAppointment(id: string) {
    return this.http.post<void>(`/api/appointments/${id}/cancel`, null);
  }

  closeAppointment(id: string, comment: string) {
    return this.http.post<void>(`/api/appointments/${id}/close`, comment);
  }

  clearAppointmentDetails() {
    this.#appointmentDetails.set({} as Appointment);
  }

  attachPatient(
    id: string,
    patientId: string,
  ) {
    return this.http.post<void>(`/api/appointments/${id}/attach-patient?patientId=${patientId}`, null);
  }

  updatePaymentStatus(
    id: string,
    request: UpdatePaymentStatusRequest,
  ) {
    return this.http.patch<void>(`/api/appointments/${id}/payment-status`, request);
  }

  checkForFirstEntry(patientId: string) {
    return this.http.get<boolean>(`/api/appointments/first-entry-check?patientId=${patientId}`);
  }

  cleatState() {
    this.#appointments.set({} as Page<Appointment>);
    this.#appointmentDetails.set({} as Appointment);
  }
}
