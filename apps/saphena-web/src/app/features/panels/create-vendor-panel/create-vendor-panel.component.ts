import {Component, inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize, switchMap} from 'rxjs';

import {AccountingService} from '../../../core/services/accounting.service';
import {CreateVendorRequest} from '../../../core/model/accounting.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';

@Component({
  selector: 'app-create-vendor-panel',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    PhoneInputFieldComponent
  ],
  templateUrl: './create-vendor-panel.component.html',
  styleUrl: './create-vendor-panel.component.scss',
  standalone: true
})
export class CreateVendorPanelComponent {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly accountingService = inject(AccountingService);

  form = new FormGroup({
    bin: new FormControl('', Validators.required),
    name: new FormControl(''),
    contactPersonName: new FormControl(''),
    contactPersonPhone: new FormControl('')
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.accountingService.createVendor(this.form.value as CreateVendorRequest)
      .pipe(
        switchMap(() => this.accountingService.getVendors()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Поставщик добавлен', '', { panelClass: 'snackbar-success' })
          this.form.reset();
        }
      })
  }

}
