import {Component, inject, OnInit, signal} from '@angular/core';
import {ChartDataset} from 'chart.js';

import {AnalyticsService} from '../../../core/services/analytics.service';
import {getTrafficSourceTypeName} from '../../../shared/utils/name.util';
import {BaseChartDirective} from 'ng2-charts';
import {YearMonthFilterComponent} from '../../../shared/components/year-month-filter/year-month-filter.component';

@Component({
  selector: 'app-patient-traffic',
  imports: [
    BaseChartDirective,
    YearMonthFilterComponent
  ],
  templateUrl: './patient-traffic.component.html',
  styleUrl: './patient-traffic.component.scss',
  standalone: true
})
export class PatientTrafficComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);
  chartLabels = signal<string[] | null>(null);
  chartDatasets = signal<ChartDataset<'pie'>[] | null>(null);

  ngOnInit() {
    this.getTrafficAnalytics(new Date().getFullYear().toString());
  }

  getTrafficAnalytics(year: string, month?: string) {
    this.analyticsService.getTrafficAnalytics(year, month)
      .subscribe(resp => {
        this.chartLabels.set(resp.map(ta => getTrafficSourceTypeName(ta.type)))
        this.chartDatasets.set([
          { data: resp.map(ta => ta.count) }
        ])
      });
  }
}
