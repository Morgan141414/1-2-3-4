import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AnalyticsDTO, TrafficAnalytics} from '../model/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly http = inject(HttpClient);

  getTrafficAnalytics(year: string, month: string = '') {
    return this.http.get<TrafficAnalytics[]>(`/api/analytics/traffic?year=${year}&month=${month}`);
  }

  getExpenseAnalytics(year: string, month: string = '') {
    return this.http.get<AnalyticsDTO[]>(`/api/analytics/expense?year=${year}&month=${month}`);
  }

  getIncomeAnalytics(year: string, month: string = '') {
    return this.http.get<AnalyticsDTO[]>(`/api/analytics/income?year=${year}&month=${month}`);
  }

}
