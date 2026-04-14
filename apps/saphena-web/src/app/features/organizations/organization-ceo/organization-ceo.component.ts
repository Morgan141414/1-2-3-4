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
  selector: 'app-organization-ceo',
  imports: [],
  templateUrl: './organization-ceo.component.html',
  styleUrl: './organization-ceo.component.scss',
  standalone: true
})
export class OrganizationCeoComponent implements OnInit, OnDestroy  {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly organizationService = inject(OrganizationService);
  id =  input.required<string>();

  ceos = this.organizationService.organizationUsers;

  ngOnInit() {
    this.organizationService.getOrganizationCEOs(this.id())
      .subscribe();
  }

  ngOnDestroy() {
    this.organizationService.clearState();
  }

  openDeleteDialog(ceo: OrganizationUser) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: ceo.user.username, subtitle: 'Вы уверены что хотите удалить CEO?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.organizationService.deleteOrganizationUser(ceo.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('CEO удален', '', { panelClass: 'snackbar-success' });
                this.organizationService.getOrganizationAdmins(this.id())
                  .subscribe()
              }
            })
        }
      })
  }

  openCreateCEOPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'organizations', this.id(), 'add-ceo'] } }]);
  }

  openEditUserPanel(id: String) {
    this.router.navigate([{ outlets: { panel: ['panels', 'users', id, 'edit'] } }]);
  }

}
