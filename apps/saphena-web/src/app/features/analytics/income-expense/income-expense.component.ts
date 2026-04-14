import {Component, inject, OnInit, signal} from '@angular/core';
import {ChartConfiguration, ChartDataset} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {forkJoin} from 'rxjs';

import {AnalyticsService} from '../../../core/services/analytics.service';
import {YearMonthFilterComponent} from '../../../shared/components/year-month-filter/year-month-filter.component';
import {AnalyticsDTO} from '../../../core/model/analytics.model';
import {NgxMaskPipe} from 'ngx-mask';

@Component({
  selector: 'app-income-expense',
  imports: [
    YearMonthFilterComponent,
    BaseChartDirective,
    NgxMaskPipe
  ],
  templateUrl: './income-expense.component.html',
  styleUrl: './income-expense.component.scss',
  standalone: true
})
export class IncomeExpenseComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);
  expenseChartLabels = signal<string[] | null>(null);
  expenseChartDatasets = signal<ChartDataset<'pie'>[] | null>(null);
  expenseAmount = signal(0);
  incomeChartLabels = signal<string[] | null>(null);
  incomeChartDatasets = signal<ChartDataset<'pie'>[] | null>(null);
  incomeAmount = signal(0);

  pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    }
  }

  ngOnInit() {
    this.getAnalytics(new Date().getFullYear().toString());
  }

  getAnalytics(year: string, month?: string) {
    forkJoin({
      expense: this.analyticsService.getExpenseAnalytics(year, month),
      income: this.analyticsService.getIncomeAnalytics(year, month),
    })
      .subscribe(response => {
        this.setExpenseChartData(response.expense);
        this.setIncomeChartData(response.income);
      });
  }

  private setExpenseChartData(analytics: AnalyticsDTO[]) {
    this.expenseChartLabels.set(analytics.map(a => a.type));
    this.expenseChartDatasets.set([
      { data: analytics.map(iea => iea.amount) }
    ]);
    this.expenseAmount.set(
      analytics.reduce((sum, item) => sum + item.amount, 0)
    );
  }

  private setIncomeChartData(analytics: AnalyticsDTO[]) {
    this.incomeChartLabels.set(analytics.map(a => a.type))
    this.incomeChartDatasets.set([
      { data: analytics.map(iea => iea.amount) }
    ]);
    this.incomeAmount.set(
      analytics.reduce((sum, item) => sum + item.amount, 0)
    );
  }

}
