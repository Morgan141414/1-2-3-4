import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {CreateProtocolRequest, Protocol, ProtocolTargetType} from '../model/protocol.model';
import {tap} from 'rxjs';
import {GenderType} from '../model/patient.model';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  private readonly http = inject(HttpClient);

  #activeProtocol = signal<Protocol | null>(null);

  activeProtocol = this.#activeProtocol.asReadonly();

  getActiveProtocol(
    targetType: ProtocolTargetType,
    targetId: string,
    gender?: GenderType,
  ) {
    return this.http.get<Protocol>(`/api/protocols?targetType=${targetType}&targetId=${targetId}&gender=${gender ?? ''}`)
      .pipe(
        tap(protocol => this.#activeProtocol.set(protocol))
      );
  }

  createProtocol(
    targetType: ProtocolTargetType,
    targetId: string,
    req: CreateProtocolRequest,
  ) {
    return this.http.post<void>(`/api/protocols?targetType=${targetType}&targetId=${targetId}`, req);
  }

  clearState() {
    this.#activeProtocol.set(null);
  }

  resetProtocolToTemplate(
    targetType: ProtocolTargetType,
    targetId: string,
  ) {
    return this.http.post<void>(`/api/protocols/reset?targetType=${targetType}&targetId=${targetId}`, null);
  }
}
