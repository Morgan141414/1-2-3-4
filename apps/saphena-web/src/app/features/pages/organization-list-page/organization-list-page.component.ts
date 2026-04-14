import {Component, inject, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import {OrganizationService} from '../../../core/services/organization.service';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';
import {OrganizationTableComponent} from '../../organizations/organization-table/organization-table.component';

@Component({
  selector: 'app-organization-list-page',
  imports: [
    PaginationComponent,
    OrganizationTableComponent
  ],
  templateUrl: './organization-list-page.component.html',
  styleUrl: './organization-list-page.component.scss',
  standalone: true
})
export class OrganizationListPageComponent implements OnDestroy {
  private readonly organizationService = inject(OrganizationService);
  private readonly router = inject(Router);

  organizations = this.organizationService.organizations;

  constructor() {
    this.getOrganizations();
  }

  ngOnDestroy() {
    this.organizationService.clearState();
  }

  getOrganizations(page?: number) {
    this.organizationService.getOrganizations({ page })
      .subscribe();
  }

  openAddOrganizationPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'organizations', 'new'] } }]);
  }
}
