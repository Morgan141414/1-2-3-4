import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ChangePasswordRequest} from '../model/auth.model';

@Injectable({
  providedIn: 'root'
})
export class MeService {
  private readonly http = inject(HttpClient);

  changePassword(req: ChangePasswordRequest) {
    return this.http.post<void>('/api/me/password', req);
  }

}
