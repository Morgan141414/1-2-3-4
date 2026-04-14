import {Component, inject, input} from '@angular/core';
import {NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

import {ProcedureService} from '../../../core/services/procedure.service';
import {Procedure, ProcedureType} from '../../../core/model/procedure.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {ProtocolConstructorDialogComponent} from '../../protocols/protocol-constructor-dialog/protocol-constructor-dialog.component';
import {ProtocolConstructorDialogData, ProtocolTargetType} from '../../../core/model/protocol.model';

@Component({
  selector: 'app-procedure-table',
  imports: [
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NgClass
  ],
  templateUrl: './procedure-table.component.html',
  styleUrl: './procedure-table.component.scss',
  standalone: true
})
export class ProcedureTableComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly procedureService = inject(ProcedureService);
  protected readonly procedureType = ProcedureType;
  specializationId = input.required<string>();

  procedures = this.procedureService.procedures;

  openEditPanel(procedureId: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'specializations', this.specializationId(), 'procedures', procedureId, 'edit'] } }]);
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

  openDeleteDialog(proc: Procedure) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: proc.name, subtitle: 'Вы уверены что хотите удалить услугу?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.procedureService.deleteProcedure(proc.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Услуга удалена', '', { panelClass: 'snackbar-success' });
                this.getProcedures();
              }
            })
        }
      })
  }

  openRestoreDialog(proc: Procedure) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: proc.name, subtitle: 'Вы уверены что хотите восстановить услугу?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.procedureService.restoreProcedure(proc.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Услуга восстановлена', '', { panelClass: 'snackbar-success' });
                this.getProcedures();
              }
            })
        }
      })
  }

  private getProcedures() {
    this.procedureService.getProcedures(this.specializationId())
      .subscribe();
  }

}
