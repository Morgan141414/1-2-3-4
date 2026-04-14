import {Component, inject, input} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

import {OrganizationProcedureService} from '../../../core/services/organization-procedure.service';
import {OrganizationProcedure, Procedure, ProcedureType} from '../../../core/model/procedure.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {NgClass} from '@angular/common';
import {ProtocolConstructorDialogData, ProtocolTargetType} from '../../../core/model/protocol.model';
import {
  ProtocolConstructorDialogComponent
} from '../../protocols/protocol-constructor-dialog/protocol-constructor-dialog.component';

@Component({
  selector: 'app-org-procedures-table',
  imports: [
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NgClass
  ],
  templateUrl: './org-procedures-table.component.html',
  styleUrl: './org-procedures-table.component.scss',
  standalone: true
})
export class OrgProceduresTableComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly orgProcedureService = inject(OrganizationProcedureService);
  protected readonly procedureType = ProcedureType;
  specializationId = input.required<string>();
  orgProcedures = this.orgProcedureService.orgProcedures;

  openEditPanel(orgProcId: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'specializations', this.specializationId(), 'org-procedures', orgProcId, 'edit'] } }]);
  }

  openProtocolDialog(procedure: Procedure) {
    const data: ProtocolConstructorDialogData = {
      targetType: ProtocolTargetType.PROCEDURE,
      targetId: procedure.id,
      targetName: procedure.name,
    }

    this.dialog.open(ProtocolConstructorDialogComponent, {
      data: data,
      maxWidth: '1600px',
      width: '90vw',
      maxHeight: '95vh',
    });
  }

  openDeleteDialog(orgProc: OrganizationProcedure) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: orgProc.procedure.name, subtitle: 'Вы уверены что хотите отключить услугу?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.orgProcedureService.disableOrganizationProcedure(orgProc.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Услуга отключена', '', { panelClass: 'snackbar-success' });
                this.getOrgProcedures();
              }
            })
        }
      })
  }

  openRestoreDialog(orgProc: OrganizationProcedure) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: orgProc.procedure.name, subtitle: 'Вы уверены что хотите восстановить услугу?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.orgProcedureService.restoreOrganizationProcedure(orgProc.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Услуга восстановлена', '', { panelClass: 'snackbar-success' });
                this.getOrgProcedures();
              }
            })
        }
      })
  }

  private getOrgProcedures() {
    this.orgProcedureService.getOrganizationProcedures(this.specializationId())
      .subscribe();
  }

}
