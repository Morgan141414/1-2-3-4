import {Component, inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize, switchMap} from 'rxjs';

import {AccountingService} from '../../../core/services/accounting.service';
import {CreateExpenseTypeRequest} from '../../../core/model/accounting.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-create-expense-type-panel',
  imports: [
    FormsModule,
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './create-expense-type-panel.component.html',
  styleUrl: './create-expense-type-panel.component.scss',
  standalone: true
})
export class CreateExpenseTypePanelComponent {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly accountingService = inject(AccountingService);

  form = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.accountingService.createExpenseType(this.form.value as CreateExpenseTypeRequest)
      .pipe(
        switchMap(() => this.accountingService.getExpenseTypes()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Тип расходов добавлен', '', { panelClass: 'snackbar-success' })
          this.form.reset();
        }
      })
  }

}
