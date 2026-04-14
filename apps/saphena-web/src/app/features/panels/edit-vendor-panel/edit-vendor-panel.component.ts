import {Component, inject, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';
import {finalize, map, switchMap} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AccountingService} from '../../../core/services/accounting.service';
import {CreateVendorRequest} from '../../../core/model/accounting.model';

@Component({
  selector: 'app-edit-vendor-panel',
  imports: [
    FormsModule,
    InputFieldComponent,
    PhoneInputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-vendor-panel.component.html',
  styleUrl: './edit-vendor-panel.component.scss',
  standalone: true
})
export class EditVendorPanelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly accountingService = inject(AccountingService);
  id = input.required<string>();

  form = new FormGroup({
    bin: new FormControl('', Validators.required),
    name: new FormControl(''),
    contactPersonName: new FormControl(''),
    contactPersonPhone: new FormControl('')
  });

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => params["id"]),
        switchMap(id => this.accountingService.getVendorById(id))
      )
      .subscribe(vendor => {
        this.form.controls.bin.setValue(vendor.bin);
        this.form.controls.name.setValue(vendor.name ?? '');
        this.form.controls.contactPersonName.setValue(vendor.contactPersonName ?? '');
        this.form.controls.contactPersonPhone.setValue(vendor.contactPersonPhone ?? '');
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.accountingService.updateVendor(this.id(), this.form.value as CreateVendorRequest)
      .pipe(
        switchMap(() => this.accountingService.getVendors()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Поставщик изменен', '', { panelClass: 'snackbar-success' })
          this.form.reset();
        }
      })
  }

}
