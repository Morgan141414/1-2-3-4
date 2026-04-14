import {Component, inject, input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize, switchMap} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

import {OrganizationService} from '../../../core/services/organization.service';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {CreateUserRequest} from '../../../core/model/user.model';

@Component({
  selector: 'app-create-organization-admin-panel',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent
  ],
  templateUrl: './create-organization-admin-panel.component.html',
  styleUrl: './create-organization-admin-panel.component.scss',
  standalone: true
})
export class CreateOrganizationAdminPanelComponent {
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

    this.organizationService.createOrganizationAdmin(this.id(), this.form.value as CreateUserRequest)
      .pipe(
        switchMap(() => this.organizationService.getOrganizationAdmins(this.id())),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Администратор добавлен', '', { panelClass: 'snackbar-success' })
          this.form.reset();
        }
      })
  }
}
