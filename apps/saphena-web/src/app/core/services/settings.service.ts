import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly http = inject(HttpClient);

  getLogo() {
    return this.http.get(`api/organization-settings/logo`, {
      responseType: 'blob',
    });
  }

  uploadLogo(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`api/organization-settings/logo`, formData, {
      responseType: 'blob',
    });
  }

  deleteLogo() {
    return this.http.delete(`api/organization-settings/logo`);
  }
}
