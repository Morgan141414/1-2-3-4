import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {
  CreateSpecializationDocumentRequest,
  SpecializationDocument
} from '../model/specialization-document.model';

@Injectable({
  providedIn: 'root'
})
export class SpecializationDocumentService {
  private readonly http = inject(HttpClient);

  #specializationDocuments = signal<SpecializationDocument[]>([]);

  specializationDocuments = this.#specializationDocuments.asReadonly();
  activeSpecializationDocumentId = signal<string>('');

  getSpecializationDocuments(specializationId: string) {
    return this.http.get<SpecializationDocument[]>(`/api/specialization-documents?specializationId=${specializationId}`)
      .pipe(
        tap(resp => this.#specializationDocuments.set(resp))
      );
  }

  getSpecializationDocument(specDocId: string) {
    return this.http.get<SpecializationDocument>(`/api/specialization-documents/${specDocId}`);
  }

  createSpecializationDocument(specializationId: string, req: CreateSpecializationDocumentRequest) {
    return this.http.post<void>(`/api/specialization-documents?specializationId=${specializationId}`, req);
  }

  updateSpecializationDocument(id: string, req: CreateSpecializationDocumentRequest) {
    return this.http.put<void>(`/api/specialization-documents/${id}`, req);
  }

  deleteSpecializationDocument(id: string) {
    return this.http.delete<void>(`/api/specialization-documents/${id}`)
  }

  restoreSpecializationDocument(id: string) {
    return this.http.patch<void>(`/api/specialization-documents/${id}/restore`, null)
  }

  getSpecDocCatalog(specializationId: string) {
    return this.http.get<SpecializationDocument[]>(`/api/specialization-documents/catalog?specializationId=${specializationId}`);
  }

  clearState() {
    this.#specializationDocuments.set([]);
    this.activeSpecializationDocumentId.set('');
  }

}
