import {Component, signal} from '@angular/core';

import {ITab, TabsComponent} from '../../../shared/components/tabs/tabs.component';
import {PatientTrafficComponent} from '../../analytics/patient-traffic/patient-traffic.component';
import {IncomeExpenseComponent} from '../../analytics/income-expense/income-expense.component';

@Component({
  selector: 'app-analytics-page',
  imports: [
    TabsComponent,
    PatientTrafficComponent,
    IncomeExpenseComponent
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss',
  standalone: true
})
export class AnalyticsPageComponent {
  tabs: ITab[] = [
    { id: 'traffic', title: 'Трафик пациентов' },
    { id: 'income-expense', title: 'Доход / расход' }
  ];
  activeTab = signal(this.tabs[0].id);

}
