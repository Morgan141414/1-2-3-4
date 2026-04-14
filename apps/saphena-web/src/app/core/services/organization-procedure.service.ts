import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs';

import {OrganizationProcedure, UpdateOrganizationProcedureRequest} from '../model/procedure.model';
import {Specialization} from '../model/specialization.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationProcedureService {
  private readonly http = inject(HttpClient);

  #orgProcedures = signal<OrganizationProcedure[]>([]);

  orgProcedures = this.#orgProcedures.asReadonly();

  getOrganizationProcedures(specializationId: string) {
    return this.http.get<OrganizationProcedure[]>(`/api/organization-procedures?specializationId=${specializationId}`)
      .pipe(
        tap(resp => this.#orgProcedures.set(resp))
      );
  }

  getOrganizationProcedure(id: string) {
    return this.http.get<OrganizationProcedure>(`/api/organization-procedures/${id}`);
  }

  updateOrganizationProcedure(
    id: string,
    request: UpdateOrganizationProcedureRequest,
  ) {
    return this.http.patch<void>(`/api/organization-procedures/${id}`, request);
  }

  disableOrganizationProcedure(id: string) {
    return this.http.delete(`/api/organization-procedures/${id}`);
  }

  restoreOrganizationProcedure(id: string) {
    return this.http.patch(`/api/organization-procedures/${id}/restore`, null);
  }

  syncOrganizationProcedures(specializationId: string,
                             procedureIds: string[]) {
    return this.http.put<void>(`/api/organization-procedures/sync?specializationId=${specializationId}`, { procedureIds });
  }

  getOrgProcedureCatalog(specializationId: string) {
    return this.http.get<OrganizationProcedure[]>(`/api/organization-procedures/catalog?specializationId=${specializationId}`);
  }

  getSpecializations() {
    return this.http.get<Specialization[]>(`/api/organization-procedures/specializations`);
  }

  cleatState() {
    this.#orgProcedures.set([]);
  }

}
