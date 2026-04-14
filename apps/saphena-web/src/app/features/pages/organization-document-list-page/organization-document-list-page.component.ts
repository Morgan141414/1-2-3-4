import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {NgClass} from '@angular/common';

import {OrganizationDocumentService} from '../../../core/services/organization-document.service';
import {OrganizationDocument} from '../../../core/model/organization-document.model';
import {ProtocolConstructorDialogData, ProtocolTargetType} from '../../../core/model/protocol.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  ProtocolConstructorDialogComponent
} from '../../protocols/protocol-constructor-dialog/protocol-constructor-dialog.component';

@Component({
  selector: 'app-organization-document-list-page',
  imports: [
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NgClass
  ],
  templateUrl: './organization-document-list-page.component.html',
  styleUrl: './organization-document-list-page.component.scss',
  standalone: true
})
export class OrganizationDocumentListPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly organizationDocumentService = inject(OrganizationDocumentService);

  organizationDocuments = this.organizationDocumentService.organizationDocuments;

  ngOnInit() {
    this.getOrganizationDocuments();
  }

  ngOnDestroy() {
    this.organizationDocumentService.clearState();
  }

  openAddDocumentPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'documents', 'new'] } }]);
  }

  openProtocolDialog(orgDoc: OrganizationDocument) {
    const data: ProtocolConstructorDialogData = {
      targetType: ProtocolTargetType.ORG_DOC,
      targetId: orgDoc.id,
      targetName: orgDoc.name,
    }

    this.dialog.open(ProtocolConstructorDialogComponent, {
      data: data,
      maxWidth: '1600px',
      width: '90vw',
      maxHeight: '95vh',
    });
  }

  openEditPanel(id: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'documents', id, 'edit'] } }]);

  }

  openDeleteDialog(orgDoc: OrganizationDocument) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: orgDoc.name, subtitle: 'Вы уверены что хотите удалить документ?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.organizationDocumentService.deleteOrganizationDocument(orgDoc.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Документ удален', '', { panelClass: 'snackbar-success' });
                this.getOrganizationDocuments();
              }
            })
        }
      })
  }

  openRestoreDialog(orgDoc: OrganizationDocument) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: orgDoc.name, subtitle: 'Вы уверены что хотите восстановить документ?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.organizationDocumentService.restoreOrganizationDocument(orgDoc.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Документ восстановлена', '', { panelClass: 'snackbar-success' });
                this.getOrganizationDocuments();
              }
            })
        }
      })
  }

  private getOrganizationDocuments() {
    this.organizationDocumentService.getOrganizationDocuments()
      .subscribe();
  }

}
