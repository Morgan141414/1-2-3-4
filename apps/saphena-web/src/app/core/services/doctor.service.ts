import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {CreateDoctorRequest, Doctor, UpdateDoctorRequest} from '../model/doctor.model';
import {Page, Pageable} from '../model/page.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private readonly http = inject(HttpClient);

  #doctorsPage = signal<Page<Doctor>>({} as Page<Doctor>);

  doctorsPage = this.#doctorsPage.asReadonly();

  getDoctors(pageable?: Pageable) {
    return this.http.get<Page<Doctor>>(`/api/doctors`,
      { params: { ...pageable }})
      .pipe(
        tap(doctors => this.#doctorsPage.set(doctors))
      );
  }

  getDoctor(id: string) {
    return this.http.get<Doctor>(`/api/doctors/${id}`);
  }

  createDoctor(req: CreateDoctorRequest) {
    return this.http.post<void>(`/api/doctors`, req);
  }

  updateDoctor(id: string, req: UpdateDoctorRequest) {
    return this.http.put<void>(`/api/doctors/${id}`, req);
  }

  removeDoctorFromOrganization(orgUserId: string) {
    return this.http.delete<void>(`/api/doctors/${orgUserId}`);
  }

  getDoctorList(specializationId: string) {
    return this.http.get<Doctor[]>(`/api/doctors/list?specializationId=${specializationId}`);
  }

  getDoctorByIin(iin: string) {
    return this.http.get<Doctor>(`/api/doctors/iin/${iin}`);
  }

  addDoctorToOrganization(id: string) {
    return this.http.post(`/api/doctors/${id}/add-to-organization`, null);
  }

  clearState() {
    this.#doctorsPage.set({} as Page<Doctor>);
  }
}
