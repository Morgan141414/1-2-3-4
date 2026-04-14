import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, switchMap} from 'rxjs';

import {OrganizationDocumentService} from '../../../core/services/organization-document.service';
import {CreateOrganizationDocumentRequest} from '../../../core/model/organization-document.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-create-organization-document-panel',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent
  ],
  templateUrl: './create-organization-document-panel.component.html',
  styleUrl: './create-organization-document-panel.component.scss',
  standalone: true
})
export class CreateOrganizationDocumentPanelComponent {
  private readonly organizationDocumentService = inject(OrganizationDocumentService);
  private readonly matSnackBar = inject(MatSnackBar);

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
    this.organizationDocumentService.createOrganizationDocument(this.form.value as CreateOrganizationDocumentRequest)
      .pipe(
        switchMap(() => this.organizationDocumentService.getOrganizationDocuments()),
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
