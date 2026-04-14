import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {
  AssistantKpiSummary,
  DoctorKpiSummary,
  KpiEvent, MyKpi,
  OperatorKpiSummary,
  ReceptionKpiSummary
} from '../model/kpi.model';
import {Page, Pageable} from '../model/page.model';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  private readonly http = inject(HttpClient);

  getDoctorsKpi(from: string,
                to: string) {
    return this.http.get<DoctorKpiSummary[]>(`/api/kpi/doctors?from=${from}&to=${to}`);
  }

  getAssistantsKpi(from: string,
                   to: string) {
    return this.http.get<AssistantKpiSummary[]>(`/api/kpi/assistants?from=${from}&to=${to}`);
  }

  getOperatorsKpi(from: string,
                  to: string) {
    return this.http.get<OperatorKpiSummary[]>(`/api/kpi/operators?from=${from}&to=${to}`);
  }

  getReceptionKpi(from: string,
                  to: string) {
    return this.http.get<ReceptionKpiSummary[]>(`/api/kpi/reception?from=${from}&to=${to}`);
  }

  getKpiEvents(userId: string,
               from: string,
               to: string,
               pageable?: Pageable) {
    return this.http.get<Page<KpiEvent>>(`/api/kpi/events?userId=${userId}&from=${from}&to=${to}`,
      { params: { ...pageable }} );
  }

  getMyKpi(from: string,
           to: string,
           pageable?: Pageable) {
    return this.http.get<MyKpi>(`/api/kpi/my?from=${from}&to=${to}`,
      { params: { ...pageable }} );
  }

}
