import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AccountingService} from '../../../core/services/accounting.service';
import {AuthService} from '../../../core/services/auth.service';
import {UserRoleType} from '../../../core/model/user.model';
import {FormsModule} from '@angular/forms';
import {NgxMaskPipe} from 'ngx-mask';

@Component({
  selector: 'app-vendor-list-page',
  imports: [
    FormsModule,
    NgxMaskPipe
  ],
  templateUrl: './vendor-list-page.component.html',
  styleUrl: './vendor-list-page.component.scss',
  standalone: true
})
export class VendorListPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly accountingService = inject(AccountingService);
  private readonly authService = inject(AuthService);
  protected readonly userRoleType = UserRoleType;
  protected readonly role = this.authService.getRole();

  vendors = this.accountingService.vendors;
  search = this.accountingService.vendorSearch;

  ngOnInit() {
    this.getVendors();
  }

  ngOnDestroy() {
    this.accountingService.clearState();
  }

  getVendors(page?: number) {
    this.accountingService.getVendors({ page })
      .subscribe();
  }

  openCreateVendorPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'vendors', 'new'] } }]);
  }

  openEditDialog(id: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'vendors', id, 'edit'] } }]);
  }

}
