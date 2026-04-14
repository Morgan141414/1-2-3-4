import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

import { AccountingService } from '../../../core/services/accounting.service';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';
import {DatePipe} from '@angular/common';
import {NgxMaskPipe} from 'ngx-mask';
import {LeadingZerosPipe} from '../../../shared/pipes/leading-zeros.pipe';

@Component({
  selector: 'app-accounting-page',
  imports: [
    FormsModule,
    PaginationComponent,
    DatePipe,
    NgxMaskPipe,
    LeadingZerosPipe
  ],
  templateUrl: './accounting-page.component.html',
  styleUrl: './accounting-page.component.scss',
  standalone: true
})
export class AccountingPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly accountingService = inject(AccountingService);

  expenses = this.accountingService.expenses;
  expenseTypes = this.accountingService.expenseTypes;
  filter = this.accountingService.filter;

  ngOnInit() {
    this.getExpenses();
    this.getExpenseTypes();
  }

  ngOnDestroy() {
    this.accountingService.clearState();
  }

  getExpenses(page?: number) {
    this.accountingService.getExpenses({ page })
      .subscribe()
  }

  openCreateExpensePanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'expenses', 'new'] } }]);
  }

  showDetails(id: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'expenses', id] } }]);
  }

  private getExpenseTypes() {
    this.accountingService.getExpenseTypes()
      .subscribe();
  }

}
