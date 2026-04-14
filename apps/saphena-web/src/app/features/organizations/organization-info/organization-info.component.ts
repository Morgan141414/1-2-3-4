import {Component, inject, input, OnInit, output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import {CreateOrganizationRequest} from '../../../core/model/organization.model';
import {OrganizationService} from '../../../core/services/organization.service';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';
import {BinInputFieldComponent} from '../../../shared/components/bin-input-field/bin-input-field.component';
import {filter, tap} from 'rxjs';

@Component({
  selector: 'app-organization-info',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    PhoneInputFieldComponent,
    BinInputFieldComponent
  ],
  templateUrl: './organization-info.component.html',
  styleUrl: './organization-info.component.scss',
  standalone: true
})
export class OrganizationInfoComponent implements OnInit {
  private readonly organizationService = inject(OrganizationService);
  private readonly matSnackBar = inject(MatSnackBar);

  id = input.required<string>();
  updated = output<void>();

  form = new FormGroup({
    clinicName: new FormControl('', Validators.required),
    organizationName: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    bin: new FormControl('', [
      Validators.pattern(/^\d{12}$/),
      Validators.required
    ]),
  });

  ngOnInit() {
    this.getOrganizationInfo();
  }

  onBinFilled() {
    this.organizationService.checkOrganizationExistByBin(this.form.controls.bin.value!)
      .pipe(
        filter(exists => exists),
        tap(() => {
          this.matSnackBar.open('Организация уже добавлена', '', {panelClass: 'snackbar-success'});
        }),
      )
      .subscribe()
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.organizationService.updateOrganization(this.id(), this.form.value as CreateOrganizationRequest)
      .subscribe({
        next: () => {
          this.matSnackBar.open('Организация обновлена', '', { panelClass: 'snackbar-success' })
          this.updated.emit();
        },
        error: () => this.form.enable()
      });
  }

  private getOrganizationInfo() {
    this.form.disable();

    this.organizationService.getOrganization(this.id())
      .subscribe(org => {
        this.form.controls.clinicName.setValue(org.clinicName);
        this.form.controls.organizationName.setValue(org.organizationName);
        this.form.controls.address.setValue(org.address);
        this.form.controls.phone.setValue(org.phone);
        this.form.controls.email.setValue(org.email);
        this.form.controls.bin.setValue(org.bin || '');
      });
  }
}
