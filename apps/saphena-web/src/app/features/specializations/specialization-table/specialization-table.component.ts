import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

import {SpecializationService} from '../../../core/services/specialization.service';
import {Specialization} from '../../../core/model/specialization.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-specialization-table',
  imports: [
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NgClass
  ],
  templateUrl: './specialization-table.component.html',
  styleUrl: './specialization-table.component.scss',
  standalone: true
})
export class SpecializationTableComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly specializationService = inject(SpecializationService);

  specializations = this.specializationService.specializations;

  openEditSpecializationPanel(id: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'specializations', id, 'edit'] } }]);
  }

  openDeleteDialog(spec: Specialization) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: spec.name, subtitle: 'Вы уверены что хотите удалить специализацию?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.specializationService.deleteSpecialization(spec.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Специализация удалена', '', { panelClass: 'snackbar-success' });
                this.specializationService.getSpecializations()
                  .subscribe()
              }
            })
        }
      })
  }

  openRestoreDialog(spec: Specialization) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: spec.name, subtitle: 'Вы уверены что хотите восстановить специализацию?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.specializationService.restoreSpecialization(spec.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Специализация восстановлена', '', { panelClass: 'snackbar-success' });
                this.specializationService.getSpecializations()
                  .subscribe()
              }
            })
        }
      })
  }

  goToProcedureListPage(id: string) {
    this.router.navigate(['specializations', id])
  }
}
