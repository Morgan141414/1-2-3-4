import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {DoctorSettings, DoctorSettingsRequest} from '../model/doctor-settings.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorSettingsService {
  private readonly http = inject(HttpClient);

  getDoctorSettings(orgUserId: string) {
    return this.http.get<DoctorSettings>(`/api/doctor-settings/${orgUserId}`);
  }

  createOrUpdateDoctorSettings(
    orgUserId: string,
    request: DoctorSettingsRequest,
  ) {
    return this.http.post<DoctorSettings>(`/api/doctor-settings/${orgUserId}`, request);
  }

  deleteDoctorSettings(orgUserId: string) {
    return this.http.delete<void>(`/api/doctor-settings/${orgUserId}`);
  }

}
