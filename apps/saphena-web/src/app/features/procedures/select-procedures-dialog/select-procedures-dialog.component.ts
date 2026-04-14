import {Component, inject, OnInit, signal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, forkJoin} from 'rxjs';

import {SpecializationService} from '../../../core/services/specialization.service';
import {ProcedureService} from '../../../core/services/procedure.service';
import {OrganizationProcedureService} from '../../../core/services/organization-procedure.service';
import {SpecializationDocumentService} from '../../../core/services/specialization-document.service';
import {OrganizationSpecDocService} from '../../../core/services/organization-spec-doc.service';
import {Specialization} from '../../../core/model/specialization.model';
import {Procedure} from '../../../core/model/procedure.model';
import {SpecializationDocument} from '../../../core/model/specialization-document.model';

interface ProcedureUiItem extends Procedure {
  added: boolean;
  orgProcedureId?: string;
  modified?: boolean;
}

interface SpecDocUiItem extends SpecializationDocument {
  added: boolean;
  orgSpecDocId?: string;
  modified?: boolean;
}

@Component({
  selector: 'app-select-procedures-dialog',
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './select-procedures-dialog.component.html',
  styleUrl: './select-procedures-dialog.component.scss',
  standalone: true
})
export class SelectProceduresDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<SelectProceduresDialogComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly specializationService = inject(SpecializationService);
  private readonly procedureService = inject(ProcedureService);
  private readonly orgProcedureService = inject(OrganizationProcedureService);
  private readonly specDocService = inject(SpecializationDocumentService);
  private readonly orgSpecDocService = inject(OrganizationSpecDocService);

  specializationCatalog = signal<Specialization[]>([]);
  selectedSpecId = signal<string | null>(null);
  procedureCatalog = signal<ProcedureUiItem[]>([]);
  specDocCatalog = signal<SpecDocUiItem[]>([]);
  loading = signal<boolean>(false);

  constructor() {
    this.getSpecializationCatalog();
  }

  ngOnInit() {
    if (this.data) {
      this.selectedSpecId.set(this.data);
      this.onSpecializationChange();
    }
  }

  onSpecializationChange() {
    if (!this.selectedSpecId()) return;

    this.getProcedureCatalogs();
    this.getSpecDocCatalogs();
  }

  save() {
    this.loading.set(true);

    const procedureIds = this.procedureCatalog()
      .filter(p => p.added)
      .map(p => p.id);
    const specDocIds = this.specDocCatalog()
      .filter(p => p.added)
      .map(sd => sd.id);

    forkJoin({
      procedures: this.orgProcedureService.syncOrganizationProcedures(this.selectedSpecId()!, procedureIds),
      specDocs: this.orgSpecDocService.syncOrgSpecDocs(this.selectedSpecId()!, specDocIds),
    })
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe(() => {
        this.matSnackBar.open('Каталог синхронизирован', '', { panelClass: 'snackbar-success' });
        this.getProcedureCatalogs();
        this.getSpecDocCatalogs();
        this.dialogRef.close(true)
      })
  }

  private getSpecializationCatalog() {
    this.specializationService.getSpecializationCatalog()
      .subscribe(resp => this.specializationCatalog.set(resp));
  }

  private getProcedureCatalogs() {
    this.loading.set(true);

    forkJoin({
      procedureCatalog: this.procedureService.getProcedureCatalog(this.selectedSpecId()!),
      orgProcedureCatalog: this.orgProcedureService.getOrgProcedureCatalog(this.selectedSpecId()!),
    })
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe(({ procedureCatalog, orgProcedureCatalog }) => {
        const uiList: ProcedureUiItem[] = procedureCatalog
          .map(p => {
            const orgProcedure = orgProcedureCatalog
              .find(op => op.procedure.id === p.id);

            return {
              ...p,
              added: !!orgProcedure,
              orgProcedureId: orgProcedure?.id,
              modified: orgProcedure?.modified,
            };
          });

        this.procedureCatalog.set(uiList);
      });
  }

  private getSpecDocCatalogs() {
    this.loading.set(true);

    forkJoin({
      specDocCatalog: this.specDocService.getSpecDocCatalog(this.selectedSpecId()!),
      orgSpecDocCatalog: this.orgSpecDocService.getOrgSpecDocCatalog(this.selectedSpecId()!),
    })
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe(({ specDocCatalog, orgSpecDocCatalog }) => {
        const uiList: SpecDocUiItem[] = specDocCatalog
          .map(sd => {
            const orgSpecDoc = orgSpecDocCatalog
              .find(o => o.specDoc.id === sd.id);

            return {
              ...sd,
              added: !!orgSpecDoc,
              orgSpecDocId: orgSpecDoc?.id,
              modified: orgSpecDoc?.modified
            };
          });

        this.specDocCatalog.set(uiList);
      });
  }

}
