import {Component, inject, input, output} from '@angular/core';
import {NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgxMaskPipe} from 'ngx-mask';

import {DoctorService} from '../../../core/services/doctor.service';
import {AuthService} from '../../../core/services/auth.service';
import {Doctor} from '../../../core/model/doctor.model';
import {UserRoleType} from '../../../core/model/user.model';
import {AppointmentStatusType} from '../../../core/model/appointment.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {getFullname} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-doctor-table',
  imports: [
    NgxMaskPipe,
    NgClass
  ],
  templateUrl: './doctor-table.component.html',
  styleUrl: './doctor-table.component.scss',
  standalone: true
})
export class DoctorTableComponent {
  private readonly router = inject(Router);
  private readonly doctorService = inject(DoctorService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  protected readonly userRoleType = UserRoleType;
  protected readonly appointmentStatusType = AppointmentStatusType;
  role = this.authService.getRole();

  doctors = input.required<Doctor[]>();
  deleted = output<void>();
  edit = output<string>();

  fullname(doctor: Doctor) {
    return getFullname(doctor.firstName, doctor.lastName, doctor.middleName);
  }

  openDeleteDialog(doctor: Doctor) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: this.fullname(doctor), subtitle: 'Вы уверены что хотите удалить доктора?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.doctorService.removeDoctorFromOrganization(doctor.orgUserId!)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Доктор удален', '', { panelClass: 'snackbar-success' });
                this.deleted.emit();
              }
            })
        }
      })
  }

  goToDoctorDetails(id: string) {
    if (this.role === UserRoleType.ROLE_SUPERADMIN) {
      return;
    }

    this.router.navigate([`/doctors/${id}`]);
  }

  openEditPanel(id: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'doctors', id, 'edit'] }}]);
  }

  openEditPasswordPanel(id: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'users', id, 'edit'] } }]);
  }
}
