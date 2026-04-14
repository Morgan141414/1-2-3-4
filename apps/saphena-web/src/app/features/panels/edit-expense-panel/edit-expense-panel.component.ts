import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgxMaskPipe} from 'ngx-mask';
import {map, switchMap} from 'rxjs';

import {AccountingService} from '../../../core/services/accounting.service';
import {Expense} from '../../../core/model/accounting.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-edit-expense-panel',
  imports: [
    NgxMaskPipe,
    DatePipe
  ],
  templateUrl: './edit-expense-panel.component.html',
  styleUrl: './edit-expense-panel.component.scss',
  standalone: true
})
export class EditExpensePanelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly accountingService = inject(AccountingService);

  expense = signal<Expense | null>(null);

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => params["id"]),
        switchMap(id => this.accountingService.getExpense(id))
      )
      .subscribe(resp => this.expense.set(resp))
  }

}
