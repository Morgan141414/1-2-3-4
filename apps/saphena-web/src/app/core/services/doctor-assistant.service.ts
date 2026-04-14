import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AddDoctorAssistantRequest, DoctorAssistant} from '../model/doctor-assistant.model';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorAssistantService {
  private readonly http = inject(HttpClient);

  #doctorAssistants = signal<DoctorAssistant[]>([]);

  doctorAssistants = this.#doctorAssistants.asReadonly();

  getDoctorAssistants(orgUserId: string) {
    return this.http.get<DoctorAssistant[]>(`/api/doctor-assistants?orgUserId=${orgUserId}`)
      .pipe(
        tap(resp => this.#doctorAssistants.set(resp))
      );
  }

  addAssistantToDoctor(request: AddDoctorAssistantRequest) {
    return this.http.post<void>(`/api/doctor-assistants`, request);
  }

  removeDoctorAssistant(id: string) {
    return this.http.delete<void>(`/api/doctor-assistants/${id}`);
  }

  clearState() {
    this.#doctorAssistants.set([]);
  }

}
