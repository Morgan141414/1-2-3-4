import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {AddDoctorProcedureRequest, DoctorProcedure} from '../model/doctor-procedure.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorProcedureService {
  private readonly http = inject(HttpClient);

  #doctorProcedures = signal<DoctorProcedure[]>([]);

  doctorProcedures = this.#doctorProcedures.asReadonly();

  getDoctorProceduresByDoctorIdAndSpecId(
    doctorId: string,
    specializationId: string,
  ) {
    return this.http.get<DoctorProcedure[]>(`/api/doctor-procedures?doctorId=${doctorId}&specializationId=${specializationId}`)
      .pipe(
        tap(resp => this.#doctorProcedures.set(resp))
      );
  }

  getDoctorProceduresByDocSpecId(docSpecId: string) {
    return this.http.get<DoctorProcedure[]>(`/api/doctor-procedures/docSpecId/${docSpecId}`)
      .pipe(
        tap(resp => this.#doctorProcedures.set(resp))
      );
  }

  addDoctorProcedure(req: AddDoctorProcedureRequest) {
    return this.http.post<void>(`/api/doctor-procedures`, req);
  }

  removeDoctorProcedure(id: string) {
    return this.http.delete<void>(`/api/doctor-procedures/${id}`);
  }

  setPrice(
    id: string,
    price: number,
  ) {
    return this.http.post<void>(`/api/doctor-procedures/${id}/price`, price);
  }

  cleatState() {
    this.#doctorProcedures.set([]);
  }
}
