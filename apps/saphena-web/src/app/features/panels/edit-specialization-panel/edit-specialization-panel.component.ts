import {Component, inject, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, map, switchMap, tap} from 'rxjs';

import {SpecializationService} from '../../../core/services/specialization.service';
import {CreateSpecializationRequest} from '../../../core/model/specialization.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-edit-specialization-panel',
  imports: [
    FormsModule,
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-specialization-panel.component.html',
  styleUrl: './edit-specialization-panel.component.scss',
  standalone: true
})
export class EditSpecializationPanelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly specializationService = inject(SpecializationService);
  id = input.required<string>();

  form = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.route.params
      .pipe(
        tap(() => this.form.disable()),
        map(params => params["id"]),
        switchMap(id => this.specializationService.getSpecialization(id))
      )
      .subscribe(spec => {
        this.form.controls.name.setValue(spec.name);
        this.form.enable();
      })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.specializationService.updateSpecialization(this.id(), this.form.value as CreateSpecializationRequest)
      .pipe(
        switchMap(() => this.specializationService.getSpecializations()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Специализация обновлена', '', { panelClass: 'snackbar-success' });
        }
      })
  }
}
