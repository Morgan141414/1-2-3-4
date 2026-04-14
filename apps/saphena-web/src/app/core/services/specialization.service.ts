import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {
  CreateSpecializationRequest,
  Specialization
} from '../model/specialization.model';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
  private readonly http = inject(HttpClient);

  #specializations = signal<Specialization[]>([]);

  specializations = this.#specializations.asReadonly();

  getSpecializations() {
    return this.http.get<Specialization[]>('/api/specializations')
      .pipe(
        tap(resp => this.#specializations.set(resp))
      );
  }

  createSpecialization(req: CreateSpecializationRequest) {
    return this.http.post<void>('/api/specializations', req);
  }

  getSpecialization(id: string) {
    return this.http.get<Specialization>(`/api/specializations/${id}`);
  }

  updateSpecialization(id: string,
                       req: CreateSpecializationRequest) {
    return this.http.put<void>(`/api/specializations/${id}`, req);
  }

  deleteSpecialization(id: string) {
    return this.http.delete<void>(`/api/specializations/${id}`);
  }

  restoreSpecialization(id: string) {
    return this.http.patch<void>(`/api/specializations/${id}/restore`, null);
  }

  getSpecializationCatalog() {
    return this.http.get<Specialization[]>('/api/specializations/catalog');
  }

  clearState() {
    this.#specializations.set([]);
  }

}
