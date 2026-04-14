import {Component, inject, input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {NgClass} from '@angular/common';

import {OrganizationSpecDocService} from '../../../core/services/organization-spec-doc.service';
import {OrganizationSpecDoc, SpecializationDocument} from '../../../core/model/specialization-document.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {Procedure} from '../../../core/model/procedure.model';
import {ProtocolConstructorDialogData, ProtocolTargetType} from '../../../core/model/protocol.model';
import {
  ProtocolConstructorDialogComponent
} from '../../protocols/protocol-constructor-dialog/protocol-constructor-dialog.component';

@Component({
  selector: 'app-org-spec-docs-table',
  imports: [
    MatMenu,
    MatMenuItem,
    NgClass,
    MatMenuTrigger
  ],
  templateUrl: './org-spec-docs-table.component.html',
  styleUrl: './org-spec-docs-table.component.scss',
  standalone: true
})
export class OrgSpecDocsTableComponent {
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly orgSpecDocService = inject(OrganizationSpecDocService);
  specializationId = input.required<string>();
  orgSpecDocs = this.orgSpecDocService.orgSpecDocs;

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

  openDeleteDialog(orgSpecDoc: OrganizationSpecDoc) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: orgSpecDoc.specDoc.name, subtitle: 'Вы уверены что хотите отключить документ?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.orgSpecDocService.disableOrgSpecDoc(orgSpecDoc.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Документ отключен', '', { panelClass: 'snackbar-success' });
                this.getOrgSpecDocs();
              }
            })
        }
      })
  }

  openRestoreDialog(orgSpecDoc: OrganizationSpecDoc) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: orgSpecDoc.specDoc.name, subtitle: 'Вы уверены что хотите восстановить документ?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.orgSpecDocService.restoreOrgSpecDoc(orgSpecDoc.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Документ восстановлен', '', { panelClass: 'snackbar-success' });
                this.getOrgSpecDocs();
              }
            })
        }
      })
  }

  private getOrgSpecDocs() {
    this.orgSpecDocService.getOrgSpecDocs(this.specializationId())
      .subscribe();
  }

}
