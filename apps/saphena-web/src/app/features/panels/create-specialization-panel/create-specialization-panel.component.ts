import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize, switchMap} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

import {SpecializationService} from '../../../core/services/specialization.service';
import {CreateSpecializationRequest} from '../../../core/model/specialization.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-create-specialization-panel',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent
  ],
  templateUrl: './create-specialization-panel.component.html',
  styleUrl: './create-specialization-panel.component.scss',
  standalone: true
})
export class CreateSpecializationPanelComponent {
  private readonly specializationService = inject(SpecializationService);
  private readonly matSnackBar = inject(MatSnackBar);

  form = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.specializationService.createSpecialization(this.form.value as CreateSpecializationRequest)
      .pipe(
        switchMap(() => this.specializationService.getSpecializations()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Специализация создана', '', { panelClass: 'snackbar-success' });
          this.form.reset();
        }
      })
  }

}
