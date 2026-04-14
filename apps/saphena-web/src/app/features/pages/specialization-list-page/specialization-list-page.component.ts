import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {SpecializationService} from '../../../core/services/specialization.service';
import {SpecializationTableComponent} from '../../specializations/specialization-table/specialization-table.component';

@Component({
  selector: 'app-specialization-list-page',
  imports: [
    SpecializationTableComponent
  ],
  templateUrl: './specialization-list-page.component.html',
  styleUrl: './specialization-list-page.component.scss',
  standalone: true
})
export class SpecializationListPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly specializationService = inject(SpecializationService);


  ngOnInit() {
    this.specializationService.getSpecializations()
      .subscribe();
  }

  ngOnDestroy() {
    this.specializationService.clearState();
  }

  openAddSpecializationPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'specializations', 'new'] } }]);
  }
}
