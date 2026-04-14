import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {SpecializationDocument} from '../model/specialization-document.model';
import {ProtocolData, CreateProtocolDataRequest, UpdateProtocolDataRequest} from '../model/protocol-data.model';
import {ProtocolTargetType} from '../model/protocol.model';

@Injectable({
  providedIn: 'root'
})
export class ProtocolDataService {
  private readonly http = inject(HttpClient);

  #protocolData = signal<ProtocolData | null>(null);
  #appointmentSpecDocs = signal<SpecializationDocument[]>([]);

  protocolData = this.#protocolData.asReadonly();
  appointmentSpecDocs = this.#appointmentSpecDocs.asReadonly();

  getProtocolData(
    targetType: ProtocolTargetType,
    targetId: string,
    appointmentId: string,
  ) {
    return this.http.get<ProtocolData>(`/api/protocol-data?targetType=${targetType}&targetId=${targetId}&appointmentId=${appointmentId}`)
      .pipe(
        tap(resp => this.#protocolData.set(resp))
      );
  }

  saveProcedureProtocolData(req: CreateProtocolDataRequest) {
    return this.http.post<void>(`/api/protocol-data/procedure`, req);
  }

  saveSpecializationDocumentProtocolData(req: CreateProtocolDataRequest) {
    return this.http.post<void>(`/api/protocol-data/spec-doc`, req);
  }

  saveOrganizationDocumentProtocolData(req: CreateProtocolDataRequest) {
    return this.http.post(`/api/protocol-data/org-doc`, req,
      { responseType: 'blob' })
      .pipe(
        tap(blob => {
          const file = new Blob([blob], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
      );
  }

  updateProcedureProtocolData(
    id: string,
    request: UpdateProtocolDataRequest,
  ) {
    return this.http.put(`/api/protocol-data/${id}`, request);
  }

  getAppointmentSpecializationDocuments(appointmentId: string) {
    return this.http.get<SpecializationDocument[]>(`/api/protocol-data/appointment-specialization-documents?appointmentId=${appointmentId}`)
      .pipe(
        tap(resp => this.#appointmentSpecDocs.set(resp))
      );
  }

  clearState() {
    this.#appointmentSpecDocs.set([]);
    this.#protocolData.set(null);
  }

  clearProtocolData() {
    this.#protocolData.set(null);
  }
}
