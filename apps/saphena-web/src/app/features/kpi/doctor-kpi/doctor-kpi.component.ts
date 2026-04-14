import {Component, inject, OnInit, signal} from '@angular/core';
import {NgxMaskPipe} from 'ngx-mask';

import {KpiService} from '../../../core/services/kpi.service';
import {DoctorKpiSummary, KpiEvent} from '../../../core/model/kpi.model';
import {Page} from '../../../core/model/page.model';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';
import {DatePipe} from '@angular/common';
import {getFullname} from "../../../shared/utils/name.util";
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-doctor-kpi',
  imports: [
    NgxMaskPipe,
    PaginationComponent,
    DatePipe,
    FormsModule
  ],
  templateUrl: './doctor-kpi.component.html',
  styleUrl: './doctor-kpi.component.scss',
  standalone: true
})
export class DoctorKpiComponent implements OnInit {
  private readonly kpiService = inject(KpiService);
  protected readonly getFullname = getFullname;
  summary = signal<DoctorKpiSummary[]>([]);
  selectedDoctorId = signal('');
  selectedDoctorFullname = signal('');
  kpiEventsPage = signal<Page<KpiEvent> | null>(null);
  from = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;
  to = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  ngOnInit() {
    this.getKpi();
  }

  showDetails(kpi: DoctorKpiSummary) {
    this.selectedDoctorId.set(kpi.doctorId);
    this.selectedDoctorFullname.set(kpi.doctorFullname);
    this.getKpiEvents();
  }

  getKpi() {
    this.kpiService.getDoctorsKpi(this.from, this.to)
      .subscribe(resp => this.summary.set(resp));
  }

  getKpiEvents(page?: number) {
    this.kpiService.getKpiEvents(
      this.selectedDoctorId(),
      this.from,
      this.to,
      { page }
    )
      .subscribe(resp => this.kpiEventsPage.set(resp));
  }

}
