import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {filter, finalize, switchMap, tap} from 'rxjs';

import {OrganizationService} from '../../../core/services/organization.service';
import {CreateOrganizationRequest} from '../../../core/model/organization.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';
import {BinInputFieldComponent} from '../../../shared/components/bin-input-field/bin-input-field.component';

@Component({
  selector: 'app-create-organization-panel',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputFieldComponent,
    PhoneInputFieldComponent,
    BinInputFieldComponent
  ],
  templateUrl: './create-organization-panel.component.html',
  styleUrl: './create-organization-panel.component.scss',
  standalone: true
})
export class CreateOrganizationPanelComponent {
  private readonly organizationService = inject(OrganizationService);
  private readonly matSnackBar = inject(MatSnackBar);

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
    this.organizationService.createOrganization(this.form.value as CreateOrganizationRequest)
      .pipe(
        switchMap(() => this.organizationService.getOrganizations()),
        finalize(() =>  this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Организация создана', '', { panelClass: 'snackbar-success' });
          this.form.reset();
        }
      })
  }

}
