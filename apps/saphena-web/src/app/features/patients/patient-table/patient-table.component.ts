import {Component, inject, input, output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {NgxMaskPipe} from 'ngx-mask';

import {PatientService} from '../../../core/services/patient.service';
import {AuthService} from '../../../core/services/auth.service';
import {Patient} from '../../../core/model/patient.model';
import {UserRoleType} from "../../../core/model/user.model";
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {getFullname, getPatientDocumentTypeName} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-patient-table',
  imports: [
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    NgxMaskPipe,
  ],
  templateUrl: './patient-table.component.html',
  styleUrl: './patient-table.component.scss',
  standalone: true
})
export class PatientTableComponent {
  private readonly patientService = inject(PatientService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  protected readonly userRoleType = UserRoleType;
  protected readonly role = this.authService.getRole();
  protected readonly getFullname = getFullname;
  protected readonly getPatientDocumentTypeName = getPatientDocumentTypeName;

  patients = input.required<Patient[]>();
  deleted = output<void>();
  edit = output<string>();

  openDeleteDialog(patient: Patient) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: getFullname(patient.firstName, patient.lastName, patient.middleName),
        subtitle: 'Вы уверены что хотите удалить пациента?'
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.patientService.deletePatient(patient.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Пациент удален', '', { panelClass: 'snackbar-success' });
                this.deleted.emit();
              }
            })
        }
      })
  }
}
