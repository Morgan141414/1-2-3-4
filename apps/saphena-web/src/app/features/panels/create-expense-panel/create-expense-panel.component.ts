import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, switchMap} from 'rxjs';

import {AccountingService} from '../../../core/services/accounting.service';
import {PanelService} from '../../../core/services/panel.service';
import {CreateExpenseRequest, ExpenseListItem} from '../../../core/model/accounting.model';
import {DateInputFieldComponent} from '../../../shared/components/date-input-field/date-input-field.component';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {NgxMaskDirective, NgxMaskPipe} from 'ngx-mask';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';

@Component({
  selector: 'app-create-expense-panel',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DateInputFieldComponent,
    InputFieldComponent,
    NgxMaskDirective,
    PhoneInputFieldComponent,
    NgxMaskPipe
  ],
  templateUrl: './create-expense-panel.component.html',
  styleUrl: './create-expense-panel.component.scss',
  standalone: true
})
export class CreateExpensePanelComponent implements OnInit {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly accountingService = inject(AccountingService);
  private readonly panelService = inject(PanelService);

  expenseTypes = this.accountingService.expenseTypes;
  form = new FormGroup({
    typeId: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    expenseList: new FormArray<FormGroup>([]),
    totalCost: new FormControl(0, Validators.required),
    vendorId: new FormControl(''),
    vendorBin: new FormControl('', Validators.minLength(9)),
    vendorName: new FormControl(''),
    contactPersonName: new FormControl(''),
    contactPersonPhone: new FormControl(''),
    comment: new FormControl(null)
  });

  ngOnInit() {
    this.addExpense();
  }

  expenseList() {
    return this.form.controls.expenseList as FormArray;
  };

  onInput() {
    if (this.form.controls.vendorBin.invalid || this.form.controls.vendorBin.value?.trim() === '') {
      return;
    }

    this.accountingService.getVendorByBin(this.form.controls.vendorBin.value!)
      .subscribe(resp => {
        if (resp) {
          this.form.controls.vendorId.setValue(resp.id);
          this.form.controls.vendorName.setValue(resp.name ?? '');
          this.form.controls.contactPersonName.setValue(resp.contactPersonName ?? '');
          this.form.controls.contactPersonPhone.setValue(resp.contactPersonPhone ?? '');
          this.form.controls.vendorName.disable();
        } else {
          this.form.controls.vendorId.setValue('');
          this.form.controls.vendorName.setValue('');
          this.form.controls.contactPersonName.setValue('');
          this.form.controls.contactPersonPhone.setValue('');
          this.form.controls.vendorName.enable();
        }
      });
  }

  addExpense() {
    const expenseGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      cost: new FormControl(0, Validators.required),
      count: new FormControl(1, [Validators.required, Validators.min(1)]),
      sum: new FormControl({ value: 0, disabled: true })
    });

    expenseGroup.get('cost')!.valueChanges.subscribe(() => this.updateItemSum(expenseGroup));
    expenseGroup.get('count')!.valueChanges.subscribe(() => this.updateItemSum(expenseGroup));

    this.expenseList().push(expenseGroup);
  }

  removeExpense(idx: number) {
    this.expenseList().removeAt(idx);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.form.disable();

    const raw = this.form.getRawValue();
    const req: CreateExpenseRequest = {
      typeId: raw.typeId!,
      vendorId: raw.vendorId!,
      vendorBin: raw.vendorBin!,
      vendorName: raw.vendorName!,
      contactPersonName: raw.contactPersonName!,
      contactPersonPhone: raw.contactPersonPhone!,
      date: raw.date!,
      expenseList: raw.expenseList as ExpenseListItem[],
      totalCost: raw.totalCost!,
      comment: raw.comment!
    };

    this.accountingService.createExpense(req)
      .pipe(
        switchMap(() => this.accountingService.getExpenses())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Расход добавлен', '', { panelClass: 'snackbar-success' });
          this.panelService.closePanel();
        }
      })
  }

  private updateItemSum(group: FormGroup): void {
    const cost = group.get('cost')!.value || 0;
    const count = group.get('count')!.value || 0;
    group.get('sum')!.setValue(cost * count, { emitEvent: false });

    this.updateTotalCost();
  }

  private updateTotalCost(): void {
    const expenseList = this.form.get('expenseList') as FormArray<FormGroup>;
    const total = expenseList.controls.reduce((acc, group) => {
      const itemCost = group.get('sum')?.value || 0;
      return acc + itemCost;
    }, 0);

    this.form.get('totalCost')!.setValue(total, { emitEvent: false });
  }
}
