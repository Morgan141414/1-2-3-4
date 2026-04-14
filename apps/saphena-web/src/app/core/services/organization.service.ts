import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs';

import {CreateOrganizationRequest, Organization, OrganizationUser} from '../model/organization.model';
import {Page, Pageable} from '../model/page.model';
import {CreateUserRequest} from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly http = inject(HttpClient);

  #organizations = signal<Page<Organization>>({} as Page<Organization>);
  #organizationUsers = signal<OrganizationUser[]>([]);

  organizations = this.#organizations.asReadonly();
  organizationUsers = this.#organizationUsers.asReadonly();

  getOrganizations(pageable?: Pageable) {
    return this.http.get<Page<Organization>>('/api/organizations', { params: { ...pageable }})
      .pipe(
        tap(resp => this.#organizations.set(resp))
      );
  }

  getOrganization(id: string) {
    return this.http.get<Organization>(`/api/organizations/${id}`);
  }

  createOrganization(req: CreateOrganizationRequest) {
    return this.http.post<void>('/api/organizations', req);
  }

  updateOrganization(id: string, req: CreateOrganizationRequest) {
    return this.http.put<void>(`/api/organizations/${id}`, req);
  }

  deleteOrganization(id: string) {
    return this.http.delete<void>(`/api/organizations/${id}`);
  }

  getOrganizationsByIds(ids: string[]) {
    let params = new HttpParams();
    ids.forEach(id => {
      params = params.append('ids', id);
    });

    return this.http.get<Organization[]>('/api/organizations/by-ids', { params });
  }

  getOrganizationCEOs(id: string) {
    return this.http.get<OrganizationUser[]>(`/api/organizations/${id}/ceos`)
      .pipe(
        tap(resp => this.#organizationUsers.set(resp))
      );
  }

  createOrganizationCEO(id: string, req: CreateUserRequest) {
    return this.http.post<void>(`/api/organizations/${id}/ceos`, req);
  }

  getOrganizationAdmins(id: string) {
    return this.http.get<OrganizationUser[]>(`/api/organizations/${id}/admins`)
      .pipe(
        tap(resp => this.#organizationUsers.set(resp))
      );
  }

  createOrganizationAdmin(id: string, req: CreateUserRequest) {
    return this.http.post<void>(`/api/organizations/${id}/admins`, req);
  }

  getOrganizationAccountants(id: string) {
    return this.http.get<OrganizationUser[]>(`/api/organizations/${id}/accountants`)
      .pipe(
        tap(resp => this.#organizationUsers.set(resp))
      );
  }

  createOrganizationAccountant(id: string, req: CreateUserRequest) {
    return this.http.post<void>(`/api/organizations/${id}/accountants`, req);
  }

  getOrganizationOperators() {
    return this.http.get<OrganizationUser[]>(`/api/organizations/operators`)
      .pipe(
        tap(resp => this.#organizationUsers.set(resp))
      );
  }

  createOrganizationOperator(req: CreateUserRequest) {
    return this.http.post<void>(`/api/organizations/operators`, req);
  }

  getOrganizationReceptionists() {
    return this.http.get<OrganizationUser[]>(`/api/organizations/receptionists`)
      .pipe(
        tap(resp => this.#organizationUsers.set(resp))
      );
  }

  createOrganizationReceptionist(req: CreateUserRequest) {
    return this.http.post<void>(`/api/organizations/receptionists`, req);
  }

  deleteOrganizationUser(id: string) {
    return this.http.delete<void>(`/api/organizations/users/${id}`);
  }

  checkOrganizationExistByBin(bin: string) {
    return this.http.get<boolean>(`/api/organizations/bin/${bin}`);
  }

  clearState() {
    this.#organizations.set({} as Page<Organization>);
    this.#organizationUsers.set([]);
  }

}
