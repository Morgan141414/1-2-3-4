import {Component, inject, input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, switchMap} from 'rxjs';

import {SpecializationDocumentService} from '../../../core/services/specialization-document.service';
import {CreateSpecializationDocumentRequest} from '../../../core/model/specialization-document.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-create-specialization-document-panel',
  imports: [
    FormsModule,
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './create-specialization-document-panel.component.html',
  styleUrl: './create-specialization-document-panel.component.scss',
  standalone: true
})
export class CreateSpecializationDocumentPanelComponent {
  private readonly specializationDocumentService = inject(SpecializationDocumentService);
  private readonly matSnackBar = inject(MatSnackBar);
  id = input.required<string>();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    nameKk: new FormControl(''),
    nameEn: new FormControl(''),
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.specializationDocumentService.createSpecializationDocument(
      this.id(),
      this.form.value as CreateSpecializationDocumentRequest)
      .pipe(
        switchMap(() => this.specializationDocumentService.getSpecializationDocuments(this.id())),
        finalize(() => {
          this.form.enable();
        })
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Документ добавлен', '', {panelClass: 'snackbar-success'});
          this.form.reset();
        }
      })
  }

}
