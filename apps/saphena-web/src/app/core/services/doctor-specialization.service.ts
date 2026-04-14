import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AddDoctorSpecializationRequest, DoctorSpecialization} from '../model/doctor-specialization.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorSpecializationService {
  private readonly http = inject(HttpClient);

  getDoctorSpecializationsByOrgUserId(orgUserId: string) {
    return this.http.get<DoctorSpecialization[]>(`/api/doctor-specializations?orgUserId=${orgUserId}`);
  }

  addDoctorSpecialization(request: AddDoctorSpecializationRequest) {
    return this.http.post<void>(`/api/doctor-specializations`, request);
  }

  removeDoctorSpecialization(id: string) {
    return this.http.delete<void>(`/api/doctor-specializations/${id}`);
  }

  getDoctorSpecializationsBySpecId(id: string) {
    return this.http.get<DoctorSpecialization[]>(`/api/doctor-specializations/by-spec-id/${id}`)
  }
}
