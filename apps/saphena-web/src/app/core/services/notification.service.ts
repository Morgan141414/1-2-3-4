import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WhatsAppClientStatus} from '../model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);

  getWhatsAppClientStatus() {
    return this.http.get<WhatsAppClientStatus>('/api/notifications/clients/status');
  }

  createWhatsAppClient() {
    return this.http.post('/api/notifications/clients', null);
  }

  deleteWhatsAppClient() {
    return this.http.delete('/api/notifications/clients');
  }

  getWhatsAppQR() {
    return this.http.get('/api/notifications/clients/qr', { responseType: 'text' });
  }
}
