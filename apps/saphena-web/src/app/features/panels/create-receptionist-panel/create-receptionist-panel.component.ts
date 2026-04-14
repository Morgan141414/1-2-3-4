import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, switchMap} from 'rxjs';

import {OrganizationService} from '../../../core/services/organization.service';
import {CreateUserRequest} from '../../../core/model/user.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-create-receptionist-panel',
  imports: [
    FormsModule,
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './create-receptionist-panel.component.html',
  styleUrl: './create-receptionist-panel.component.scss',
  standalone: true
})
export class CreateReceptionistPanelComponent {
  private readonly organizationService = inject(OrganizationService);
  private readonly matSnackBar = inject(MatSnackBar);

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

    this.organizationService.createOrganizationReceptionist(this.form.value as CreateUserRequest)
      .pipe(
        switchMap(() => this.organizationService.getOrganizationReceptionists()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Ресепшен оператор добавлен', '', { panelClass: 'snackbar-success' })
          this.form.reset();
        }
      })
  }

}
