import {Component, effect, inject, OnDestroy, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {switchMap} from 'rxjs';

import {OrganizationService} from '../../../core/services/organization.service';
import {OrganizationUser} from '../../../core/model/organization.model';
import {PanelService} from '../../../core/services/panel.service';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {ITab, TabsComponent} from '../../../shared/components/tabs/tabs.component';

@Component({
  selector: 'app-operator-list-page',
  imports: [
    TabsComponent
  ],
  templateUrl: './operator-list-page.component.html',
  styleUrl: './operator-list-page.component.scss',
  standalone: true
})
export class OperatorListPageComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly organizationService = inject(OrganizationService);
  private readonly panelService = inject(PanelService);

  tabs: ITab[] = [
    { id: 'receptionists', title: 'Ресепшен' },
    { id: 'operators', title: 'Операторы' }
  ];
  activeTab = signal(this.tabs[0].id);
  users = this.organizationService.organizationUsers;

  constructor() {
    effect(() => {
      if (this.activeTab() === 'receptionists') {
        this.getReceptionists();
      } else {
        this.getOperators();
      }
    });
  }

  ngOnDestroy() {
    this.organizationService.clearState();
  }

  openDeleteDialog(operator: OrganizationUser) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: operator.user.username, subtitle: 'Вы уверены что хотите удалить оператора?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.organizationService.deleteOrganizationUser(operator.id)
            .pipe(
              switchMap(() => {
                if (this.activeTab() === 'receptionists') {
                  return this.organizationService.getOrganizationReceptionists()
                } else {
                  return this.organizationService.getOrganizationOperators()
                }
              })
            )
            .subscribe(_ => {
              this.matSnackBar.open('Оператор удален', '', { panelClass: 'snackbar-success' });
            });
        }
      })
  }

  openAddOperatorPanel() {
    if (this.activeTab() === 'receptionists') {
      this.router.navigate([{ outlets: { panel: ['panels', 'receptionists', 'new'] } }]);
    } else {
      this.router.navigate([{ outlets: { panel: ['panels', 'operators', 'new'] } }]);
    }
  }

  openEditUserPanel(id: String) {
    this.router.navigate([{ outlets: { panel: ['panels', 'users', id, 'edit'] } }]);
  }

  onTabChanged(tabId: string) {
    this.activeTab.set(tabId);
    this.panelService.closePanel();
  }

  private getReceptionists() {
    this.organizationService.getOrganizationReceptionists()
      .subscribe();
  }

  private getOperators() {
    this.organizationService.getOrganizationOperators()
      .subscribe();
  }
}
