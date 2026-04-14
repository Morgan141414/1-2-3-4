import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UpdateUserRequest, User} from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  getUser(id: string) {
    return this.http.get<User>(`/api/users/${id}`);
  }

  updateUser(id: string, req: UpdateUserRequest) {
    return this.http.put<void>(`/api/users/${id}`, req);
  }
}
