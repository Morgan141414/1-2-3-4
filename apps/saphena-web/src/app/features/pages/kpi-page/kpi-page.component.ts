import {Component, signal} from '@angular/core';

import {ITab, TabsComponent} from '../../../shared/components/tabs/tabs.component';
import {DoctorKpiComponent} from '../../kpi/doctor-kpi/doctor-kpi.component';
import {MedStaffKpiComponent} from '../../kpi/med-staff-kpi/med-staff-kpi.component';
import {OperatorKpiComponent} from '../../kpi/operator-kpi/operator-kpi.component';
import {ReceptionKpiComponent} from '../../kpi/reception-kpi/reception-kpi.component';

@Component({
  selector: 'app-kpi-page',
  imports: [
    TabsComponent,
    DoctorKpiComponent,
    MedStaffKpiComponent,
    OperatorKpiComponent,
    ReceptionKpiComponent
  ],
  templateUrl: './kpi-page.component.html',
  styleUrl: './kpi-page.component.scss',
  standalone: true
})
export class KpiPageComponent {
  tabs: ITab[] = [
    { id: 'doctor', title: 'Врачи' },
    { id: 'med-staff', title: 'Доп. персонал' },
    { id: 'operator', title: 'Операторы' },
    { id: 'receptionist', title: 'Ресепшен' },
  ];
  activeTab = signal(this.tabs[0].id);

}
