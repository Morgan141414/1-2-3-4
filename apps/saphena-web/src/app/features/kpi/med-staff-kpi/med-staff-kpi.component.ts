import {Component, inject, OnInit, signal} from '@angular/core';

import {KpiService} from '../../../core/services/kpi.service';
import {AssistantKpiSummary, KpiEvent} from '../../../core/model/kpi.model';
import {getAssistantTypeName, getFullname} from '../../../shared/utils/name.util';
import {Page} from '../../../core/model/page.model';
import {DatePipe} from '@angular/common';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-med-staff-kpi',
  imports: [
    DatePipe,
    PaginationComponent,
    FormsModule
  ],
  templateUrl: './med-staff-kpi.component.html',
  styleUrl: './med-staff-kpi.component.scss',
  standalone: true
})
export class MedStaffKpiComponent implements OnInit {
  private readonly kpiService = inject(KpiService);
  protected readonly getAssistantTypeName = getAssistantTypeName;
  protected readonly getFullname = getFullname;
  summary = signal<AssistantKpiSummary[]>([]);
  selectedAssistantId = signal('');
  selectedAssistantFullname = signal('');
  kpiEventsPage = signal<Page<KpiEvent> | null>(null);
  from = `${2025}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;
  to = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  ngOnInit() {
    this.getKpi();
  }

  showDetails(kpi: AssistantKpiSummary) {
    this.selectedAssistantId.set(kpi.assistantId);
    this.selectedAssistantFullname.set(kpi.assistantFullname);
    this.getKpiEvents();
  }

  getKpi() {
    this.kpiService.getAssistantsKpi(this.from, this.to)
      .subscribe(resp => this.summary.set(resp));
  }

  getKpiEvents(page?: number) {
    this.kpiService.getKpiEvents(
      this.selectedAssistantId(),
      this.from,
      this.to,
      { page }
    )
      .subscribe(resp => this.kpiEventsPage.set(resp));
  }

}
