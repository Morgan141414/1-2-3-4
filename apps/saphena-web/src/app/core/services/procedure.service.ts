import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {CreateProcedureRequest, Procedure} from '../model/procedure.model';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {
  private readonly http = inject(HttpClient);

  #procedures = signal<Procedure[]>([]);

  procedures = this.#procedures.asReadonly();

  getProcedures(specializationId: string) {
    return this.http.get<Procedure[]>(`/api/procedures?specializationId=${specializationId}`)
      .pipe(
        tap(procedures => this.#procedures.set(procedures))
      );
  }

  createProcedure(specializationId: string,
                  req: CreateProcedureRequest) {
    return this.http.post<void>(`/api/procedures?specializationId=${specializationId}`, req);
  }

  getProcedure(id: string) {
    return this.http.get<Procedure>(`/api/procedures/${id}`);
  }

  updateProcedure(id: string, req: CreateProcedureRequest) {
    return this.http.put<void>(`/api/procedures/${id}`, req);
  }

  deleteProcedure(id: string) {
    return this.http.delete<void>(`/api/procedures/${id}`);
  }

  restoreProcedure(id: string) {
    return this.http.patch<void>(`/api/procedures/${id}/restore`, null);
  }

  getProcedureCatalog(specializationId: string) {
    return this.http.get<Procedure[]>(`/api/procedures/catalog?specializationId=${specializationId}`)
  }

  cleatState() {
    this.#procedures.set([]);
  }

}
