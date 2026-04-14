import {Component, inject, OnInit, signal} from '@angular/core';

import {KpiService} from '../../../core/services/kpi.service';
import {ReceptionKpiSummary} from '../../../core/model/kpi.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-reception-kpi',
  imports: [
    FormsModule
  ],
  templateUrl: './reception-kpi.component.html',
  styleUrl: './reception-kpi.component.scss',
  standalone: true
})
export class ReceptionKpiComponent implements OnInit {
  private readonly kpiService = inject(KpiService);
  summary = signal<ReceptionKpiSummary[]>([]);
  from = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;
  to = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  ngOnInit() {
    this.getKpi();
  }

  getKpi() {
    this.kpiService.getReceptionKpi(this.from, this.to)
      .subscribe(resp => this.summary.set(resp));
  }

}
