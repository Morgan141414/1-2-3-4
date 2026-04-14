import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {OrganizationProcedureService} from '../../../core/services/organization-procedure.service';
import {OrganizationSpecDocService} from '../../../core/services/organization-spec-doc.service';
import {ITab, TabsComponent} from '../../../shared/components/tabs/tabs.component';
import {forkJoin} from 'rxjs';
import {
  SelectProceduresDialogComponent
} from '../../procedures/select-procedures-dialog/select-procedures-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {OrgProceduresTableComponent} from '../../procedures/org-procedures-table/org-procedures-table.component';
import {OrgSpecDocsTableComponent} from '../../spec-docs/org-spec-docs-table/org-spec-docs-table.component';

@Component({
  selector: 'app-specialization-catalog-details-page',
  imports: [
    TabsComponent,
    OrgProceduresTableComponent,
    OrgSpecDocsTableComponent
  ],
  templateUrl: './specialization-catalog-details-page.component.html',
  styleUrl: './specialization-catalog-details-page.component.scss',
  standalone: true
})
export class SpecializationCatalogDetailsPageComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly organizationProcedureService = inject(OrganizationProcedureService);
  private readonly orgSpecDocService = inject(OrganizationSpecDocService);
  id = input.required<string>();

  tabs: ITab[] = [
    { id: 'procedures', title: 'Услуги' },
    { id: 'documents', title: 'Документы '}
  ];
  activeTab = signal<string>('procedures');

  ngOnInit() {
    this.getOrgProceduresAndOrgSpecDocs();
  }

  ngOnDestroy() {
    this.organizationProcedureService.cleatState();
    this.orgSpecDocService.cleatState();
  }

  syncCatalog() {
    const dialogRef = this.dialog.open(SelectProceduresDialogComponent,
      {
        data: this.id(),
        maxWidth: '1600px',
        width: '90vw',
        height: '95vh',
      }
    );

    dialogRef.afterClosed()
      .subscribe(synced => {
        if (synced) {
          this.getOrgProceduresAndOrgSpecDocs();
        }
      })
  }

  selectTab(id: string) {
    this.activeTab.set(id);
  }

  private getOrgProceduresAndOrgSpecDocs() {
    forkJoin({
      orgProcedures: this.organizationProcedureService.getOrganizationProcedures(this.id()),
      orgSpecDocs: this.orgSpecDocService.getOrgSpecDocs(this.id())
    })
      .subscribe();
  }

}
