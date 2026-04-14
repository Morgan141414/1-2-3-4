import {Component, inject, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, map, switchMap, tap} from 'rxjs';

import {SpecializationDocumentService} from '../../../core/services/specialization-document.service';
import {CreateSpecializationDocumentRequest} from '../../../core/model/specialization-document.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-edit-specialization-document-panel',
  imports: [
    FormsModule,
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-specialization-document-panel.component.html',
  styleUrl: './edit-specialization-document-panel.component.scss',
  standalone: true
})
export class EditSpecializationDocumentPanelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly specializationDocumentService = inject(SpecializationDocumentService);
  id = input.required<string>();
  specDocId = input.required<string>();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    nameKk: new FormControl(''),
    nameEn: new FormControl(''),
  });

  ngOnInit() {
    this.route.params
      .pipe(
        tap(() => this.form.disable()),
        map(params => params["specDocId"]),
        switchMap(specDocId => this.specializationDocumentService.getSpecializationDocument(specDocId))
      )
      .subscribe(resp => {
        this.form.controls.name.setValue(resp.name);
        this.form.controls.nameKk.setValue(resp.nameKk ?? '');
        this.form.controls.nameEn.setValue(resp.nameEn ?? '');
        this.form.enable();
      })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.specializationDocumentService.updateSpecializationDocument(this.specDocId(), this.form.value as CreateSpecializationDocumentRequest)
      .pipe(
        switchMap(() => this.specializationDocumentService.getSpecializationDocuments(this.id())),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Документ обновлен', '', { panelClass: 'snackbar-success' });
        }
      })
  }

}
