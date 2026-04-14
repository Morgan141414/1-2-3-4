import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {AddAppointmentProcedureRequest, AppointmentProcedure} from '../model/appointment-procedure.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentProcedureService {
  private readonly http = inject(HttpClient);

  #appointmentProcedures = signal<AppointmentProcedure[] | null>(null);

  appointmentProcedures = this.#appointmentProcedures.asReadonly();

  getAppointmentProcedures(appointmentId: string) {
    return this.http.get<AppointmentProcedure[]>(`/api/appointment-procedures?appointmentId=${appointmentId}`)
      .pipe(
        tap(resp => this.#appointmentProcedures.set(resp))
      );
  }

  addProcedureToAppointment(appointmentId: string,
                            request: AddAppointmentProcedureRequest) {
    return this.http.post<void>(`/api/appointment-procedures?appointmentId=${appointmentId}`, request);
  }

  closeAppointmentProcedure(id: string) {
    return this.http.put<void>(`/api/appointment-procedures/${id}/close`, null);
  }

  clearState() {
    this.#appointmentProcedures.set([]);
  }
}
