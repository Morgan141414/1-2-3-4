import {Component, inject, input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {Router} from '@angular/router';

import {SpecializationDocumentService} from '../../../core/services/specialization-document.service';
import {SpecializationDocument} from '../../../core/model/specialization-document.model';
import {NgClass} from '@angular/common';
import {ProtocolConstructorDialogData, ProtocolTargetType} from '../../../core/model/protocol.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  ProtocolConstructorDialogComponent
} from '../../protocols/protocol-constructor-dialog/protocol-constructor-dialog.component';

@Component({
  selector: 'app-spec-doc-table',
  imports: [
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NgClass
  ],
  templateUrl: './spec-doc-table.component.html',
  styleUrl: './spec-doc-table.component.scss',
  standalone: true
})
export class SpecDocTableComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly specializationDocumentService = inject(SpecializationDocumentService);
  specializationId = input.required<string>();

  specializationDocuments = this.specializationDocumentService.specializationDocuments;

  openProtocolDialog(specDoc: SpecializationDocument) {
    const data: ProtocolConstructorDialogData = {
      targetType: ProtocolTargetType.SPEC_DOC,
      targetId: specDoc.id,
      targetName: specDoc.name,
    }

    this.dialog.open(ProtocolConstructorDialogComponent, {
      data: data,
      maxWidth: '1600px',
      width: '90vw',
      maxHeight: '95vh',
    });
  }

  openEditPanel(id: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'specializations', this.specializationId(), 'spec-docs', id, 'edit'] } }]);
  }

  openDeleteDialog(specDoc: SpecializationDocument) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: specDoc.name, subtitle: 'Вы уверены что хотите удалить документ?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.specializationDocumentService.deleteSpecializationDocument(specDoc.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Документ удален', '', { panelClass: 'snackbar-success' });
                this.getSpecializationDocuments();
              }
            })
        }
      })
  }

  openRestoreDialog(specDoc: SpecializationDocument) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: specDoc.name, subtitle: 'Вы уверены что хотите восстановить документ?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.specializationDocumentService.restoreSpecializationDocument(specDoc.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Документ восстановлена', '', { panelClass: 'snackbar-success' });
                this.getSpecializationDocuments();
              }
            })
        }
      })
  }

  private getSpecializationDocuments() {
    this.specializationDocumentService.getSpecializationDocuments(this.specializationId())
      .subscribe();
  }

}
