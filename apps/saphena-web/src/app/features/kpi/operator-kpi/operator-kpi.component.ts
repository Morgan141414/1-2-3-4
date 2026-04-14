import {Component, inject, OnInit, signal} from '@angular/core';

import {KpiService} from '../../../core/services/kpi.service';
import {OperatorKpiSummary} from '../../../core/model/kpi.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-operator-kpi',
  imports: [
    FormsModule
  ],
  templateUrl: './operator-kpi.component.html',
  styleUrl: './operator-kpi.component.scss',
  standalone: true
})
export class OperatorKpiComponent implements OnInit {
  private readonly kpiService = inject(KpiService);
  summary = signal<OperatorKpiSummary[]>([]);
  from = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;
  to = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  ngOnInit() {
    this.getKpi();
  }

  getKpi() {
    this.kpiService.getOperatorsKpi(this.from, this.to)
      .subscribe(resp => this.summary.set(resp));
  }

}
