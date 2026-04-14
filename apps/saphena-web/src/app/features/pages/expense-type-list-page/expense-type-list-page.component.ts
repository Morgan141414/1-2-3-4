import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {switchMap} from 'rxjs';

import {AccountingService} from '../../../core/services/accounting.service';
import {ExpenseType} from '../../../core/model/accounting.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {LeadingZerosPipe} from '../../../shared/pipes/leading-zeros.pipe';
import {AuthService} from '../../../core/services/auth.service';
import {UserRoleType} from '../../../core/model/user.model';

@Component({
  selector: 'app-expense-type-list-page',
  imports: [
    LeadingZerosPipe
  ],
  templateUrl: './expense-type-list-page.component.html',
  styleUrl: './expense-type-list-page.component.scss',
  standalone: true
})
export class ExpenseTypeListPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly accountingService = inject(AccountingService);
  private readonly authService = inject(AuthService);
  protected readonly userRoleType = UserRoleType;
  protected readonly role = this.authService.getRole();

  expenseTypes = this.accountingService.expenseTypes;

  ngOnInit() {
    this.accountingService.getExpenseTypes()
      .subscribe();
  }

  ngOnDestroy() {
    this.accountingService.clearState();
  }

  openCreateExpenseTypePanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'expense-types', 'new'] } }]);
  }

  openDeleteDialog(expenseType: ExpenseType) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: expenseType.name, subtitle: 'Вы уверены что хотите удалить тип расходов?'  }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.accountingService.deleteExpenseType(expenseType.id)
            .pipe(
              switchMap(() => this.accountingService.getExpenseTypes())
            )
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Тип расходов удален', '', { panelClass: 'snackbar-success' });
              }
            })
        }
      })
  }

}
