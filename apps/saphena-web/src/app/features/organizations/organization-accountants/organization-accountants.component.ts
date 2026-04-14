import {Component, inject, input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {OrganizationService} from '../../../core/services/organization.service';
import {OrganizationUser} from '../../../core/model/organization.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-organization-accountants',
  imports: [],
  templateUrl: './organization-accountants.component.html',
  styleUrl: './organization-accountants.component.scss',
  standalone: true
})
export class OrganizationAccountantsComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly organizationService = inject(OrganizationService);
  id =  input.required<string>();

  accountants = this.organizationService.organizationUsers;

  ngOnInit() {
    this.organizationService.getOrganizationAccountants(this.id())
      .subscribe();
  }

  ngOnDestroy() {
    this.organizationService.clearState();
  }

  openDeleteDialog(admin: OrganizationUser) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: admin.user.username, subtitle: 'Вы уверены что хотите удалить бухгалтера?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.organizationService.deleteOrganizationUser(admin.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Бухгалтер удален', '', { panelClass: 'snackbar-success' });
                this.organizationService.getOrganizationAccountants(this.id())
                  .subscribe()
              }
            })
        }
      })
  }

  openCreateAccountantPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'organizations', this.id(), 'add-accountant'] } }]);
  }

  openEditUserPanel(id: String) {
    this.router.navigate([{ outlets: { panel: ['panels', 'users', id, 'edit'] } }]);
  }

}
