import {Component, inject, input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, switchMap} from 'rxjs';

import {OrganizationService} from '../../../core/services/organization.service';
import {CreateUserRequest} from '../../../core/model/user.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-create-organization-ceo-panel',
  imports: [
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './create-organization-ceo-panel.component.html',
  styleUrl: './create-organization-ceo-panel.component.scss',
  standalone: true
})
export class CreateOrganizationCeoPanelComponent {
  private readonly organizationService = inject(OrganizationService);
  private readonly matSnackBar = inject(MatSnackBar);
  id = input.required<string>();

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.organizationService.createOrganizationCEO(this.id(), this.form.value as CreateUserRequest)
      .pipe(
        switchMap(() => this.organizationService.getOrganizationCEOs(this.id())),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('CEO добавлен', '', { panelClass: 'snackbar-success' })
          this.form.reset();
        }
      })
  }

}
