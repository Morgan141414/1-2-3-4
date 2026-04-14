import {Component, inject, input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize, map, switchMap, tap} from 'rxjs';

import {OrganizationDocumentService} from '../../../core/services/organization-document.service';
import {CreateOrganizationDocumentRequest} from '../../../core/model/organization-document.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-edit-organization-document-panel',
  imports: [
    FormsModule,
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-organization-document-panel.component.html',
  styleUrl: './edit-organization-document-panel.component.scss',
  standalone: true
})
export class EditOrganizationDocumentPanelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly organizationDocumentService = inject(OrganizationDocumentService);
  id = input.required<string>();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    nameKk: new FormControl(''),
    nameEn: new FormControl(''),
  });

  ngOnInit() {
    this.route.params
      .pipe(
        tap(() => this.form.disable()),
        map(params => params["id"]),
        switchMap(id => this.organizationDocumentService.getOrganizationDocument(id))
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
    this.organizationDocumentService.updateOrganizationDocument(this.id(), this.form.value as CreateOrganizationDocumentRequest)
      .pipe(
        switchMap(() => this.organizationDocumentService.getOrganizationDocuments()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Документ обновлен', '', { panelClass: 'snackbar-success' });
        }
      })
  }

}
