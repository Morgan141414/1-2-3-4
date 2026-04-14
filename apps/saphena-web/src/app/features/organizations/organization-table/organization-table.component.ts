import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgxMaskPipe} from 'ngx-mask';

import {OrganizationService} from '../../../core/services/organization.service';
import {Organization} from '../../../core/model/organization.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-organization-table',
  imports: [
    RouterLink,
    NgxMaskPipe
  ],
  templateUrl: './organization-table.component.html',
  styleUrl: './organization-table.component.scss',
  standalone: true
})
export class OrganizationTableComponent {
  private readonly organizationService = inject(OrganizationService);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);

  organizations = this.organizationService.organizations;

  openDeleteDialog(org: Organization) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: org.clinicName, subtitle: 'Вы уверены что хотите удалить организацию?'  }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.organizationService.deleteOrganization(org.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Организация удалена', '', { panelClass: 'snackbar-success' })
                this.organizationService.getOrganizations()
                  .subscribe()
              }
            })
        }
      })
  }
}
