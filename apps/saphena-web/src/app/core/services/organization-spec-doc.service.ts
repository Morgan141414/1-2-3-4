import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs';

import {OrganizationSpecDoc} from '../model/specialization-document.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationSpecDocService {
  private readonly http = inject(HttpClient);

  #orgSpecDocs = signal<OrganizationSpecDoc[]>([]);

  orgSpecDocs = this.#orgSpecDocs.asReadonly();

  getOrgSpecDocs(specializationId: string) {
    return this.http.get<OrganizationSpecDoc[]>(`/api/organization-spec-docs?specializationId=${specializationId}`)
      .pipe(
        tap(resp => this.#orgSpecDocs.set(resp))
      );
  }

  disableOrgSpecDoc(id: string) {
    return this.http.delete(`/api/organization-spec-docs/${id}`);
  }

  restoreOrgSpecDoc(id: string) {
    return this.http.patch(`/api/organization-spec-docs/${id}/restore`, null);
  }

  syncOrgSpecDocs(specializationId: string,
                  specDocIds: string[]) {
    return this.http.put<void>(`/api/organization-spec-docs/sync?specializationId=${specializationId}`, { specDocIds });
  }

  getOrgSpecDocCatalog(specializationId: string) {
    return this.http.get<OrganizationSpecDoc[]>(`/api/organization-spec-docs/catalog?specializationId=${specializationId}`);
  }

  cleatState() {
    this.#orgSpecDocs.set([]);
  }

}
