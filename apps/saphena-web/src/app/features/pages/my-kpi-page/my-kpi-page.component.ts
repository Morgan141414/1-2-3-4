import {Component, inject, OnInit, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxMaskPipe} from 'ngx-mask';

import {KpiService} from '../../../core/services/kpi.service';
import {MyKpi} from '../../../core/model/kpi.model';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';
import {getFullname} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-my-kpi-page',
  imports: [
    DatePipe,
    NgxMaskPipe,
    PaginationComponent,
    FormsModule
  ],
  templateUrl: './my-kpi-page.component.html',
  styleUrl: './my-kpi-page.component.scss',
  standalone: true
})
export class MyKpiPageComponent implements OnInit {
  private readonly kpiService = inject(KpiService);
  protected readonly getFullname = getFullname;
  kpi = signal<MyKpi | null>(null);
  from = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;
  to = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  ngOnInit() {
    this.getKpi();
  }

  getKpi(page?: number) {
    this.kpiService.getMyKpi(this.from.toString(), this.to.toString(), { page })
      .subscribe(resp => this.kpi.set(resp));
  }

}
