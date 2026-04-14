import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {Page, Pageable} from '../model/page.model';
import {CreatePatientRequest, Patient, PatientDocumentType, UpdatePatientRequest} from '../model/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly http = inject(HttpClient);

  patients = signal<Page<Patient>>({} as Page<Patient>);
  search = signal('');

  getPatients(pageable?: Pageable) {
    return this.http.get<Page<Patient>>('/api/patients',
      { params: { ...pageable, search: this.search() }})
      .pipe(
        tap(resp => this.patients.set(resp))
      );
  }

  getPatient(id: string) {
    return this.http.get<Patient>(`/api/patients/${id}`);
  }

  createPatient(req: CreatePatientRequest) {
    return this.http.post<void>('/api/patients', req);
  }

  updatePatient(id: string, req: UpdatePatientRequest) {
    return this.http.put<void>(`/api/patients/${id}`, req);
  }

  deletePatient(id: string) {
    return this.http.delete<void>(`/api/patients/${id}`);
  }

  checkPatientExistByIin(iin: string) {
    return this.http.get<boolean>(`/api/patients/iin/${iin}`);
  }

  checkPatientExistByDocNumber(docNumber: string,
                               docType: PatientDocumentType) {
    return this.http.get<boolean>(`/api/patients/doc-number?number=${docNumber}&type=${docType}`);
  }

  verifyPatient(
    id: string,
    comment?: string,
  ) {
    return this.http.post<void>(`/api/patients/${id}/verify?comment=${comment}`, null);
  }

  rejectPatientVerification(
    id: string,
    comment?: string,
  ) {
    return this.http.post<void>(`/api/patients/${id}/reject?comment=${comment}`, null);
  }

  sendPhoneVerificationCode(
    id: string,
    phone: string,
  ) {
    return this.http.post<void>(`/api/patients/${id}/phone-verification/send?phone=${phone}`, null);
  }

  verifyPhoneVerificationCode(
    id: string,
    code: string,
  ) {
    return this.http.post<boolean>(`/api/patients/${id}/phone-verification/verify?code=${code}`, null);
  }

  clearState() {
    this.patients.set({} as Page<Patient>);
    this.search.set('');
  }

}
