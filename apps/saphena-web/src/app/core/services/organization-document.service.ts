import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {CreateOrganizationDocumentRequest, OrganizationDocument} from '../model/organization-document.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationDocumentService {
  private readonly http = inject(HttpClient);

  #organizationDocuments = signal<OrganizationDocument[]>([]);

  organizationDocuments = this.#organizationDocuments.asReadonly();

  getOrganizationDocuments() {
    return this.http.get<OrganizationDocument[]>(`/api/organization-documents`)
      .pipe(
        tap(resp => this.#organizationDocuments.set(resp))
      );
  }

  createOrganizationDocument(req: CreateOrganizationDocumentRequest) {
    return this.http.post<void>(`/api/organization-documents`, req);
  }

  getOrganizationDocument(id: string) {
    return this.http.get<OrganizationDocument>(`/api/organization-documents/${id}`)
  }

  updateOrganizationDocument(
    id: string,
    req: CreateOrganizationDocumentRequest,
    ) {
    return this.http.put<void>(`/api/organization-documents/${id}`, req);
  }

  deleteOrganizationDocument(id: string) {
    return this.http.delete<void>(`/api/organization-documents/${id}`)
  }

  restoreOrganizationDocument(id: string) {
    return this.http.patch<void>(`/api/organization-documents/${id}/restore`, null)
  }

  getOrgDocCatalog() {
    return this.http.get<OrganizationDocument[]>(`/api/organization-documents/catalog`);
  }

  clearState() {
    this.#organizationDocuments.set([]);
  }

}
