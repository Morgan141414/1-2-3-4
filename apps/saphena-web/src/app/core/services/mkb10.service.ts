import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Mkb10} from '../model/mkb10.model';

@Injectable({
  providedIn: 'root'
})
export class Mkb10Service {
  private readonly http = inject(HttpClient);

  getMkb10Dictionary() {
    return this.http.get<Mkb10[]>('/api/mkb10');
  }

  uploadMkb10Dictionary(formData: FormData) {
    return this.http.post<void>('/api/mkb10', formData);
  }
}
