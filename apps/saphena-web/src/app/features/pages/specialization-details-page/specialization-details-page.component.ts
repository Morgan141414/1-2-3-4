import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';

import {ProcedureService} from '../../../core/services/procedure.service';
import {SpecializationDocumentService} from '../../../core/services/specialization-document.service';
import {PanelService} from '../../../core/services/panel.service';
import {ProcedureTableComponent} from '../../procedures/procedure-table/procedure-table.component';
import {ITab, TabsComponent} from '../../../shared/components/tabs/tabs.component';
import {
  SpecDocTableComponent
} from '../../spec-docs/spec-doc-table/spec-doc-table.component';

@Component({
  selector: 'app-specialization-details-page',
  imports: [
    ProcedureTableComponent,
    TabsComponent,
    SpecDocTableComponent
  ],
  templateUrl: './specialization-details-page.component.html',
  styleUrl: './specialization-details-page.component.scss',
  standalone: true
})
export class SpecializationDetailsPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly procedureService = inject(ProcedureService);
  private readonly specializationDocumentService = inject(SpecializationDocumentService);
  private readonly panelService = inject(PanelService);
  id = input.required<string>();

  specializationName = signal('');
  tabs: ITab[] = [
    { id: 'procedures', title: 'Услуги' },
    { id: 'documents', title: 'Документы '}
  ];
  activeTab = signal<string>('procedures');

  ngOnInit() {
    this.getProcedures();
    this.getDocuments();
  }

  ngOnDestroy() {
    this.procedureService.cleatState();
    this.specializationDocumentService.clearState();
  }

  openAddProcedurePanel() {
    this.router.navigate([{
      outlets: { panel: ['panels', 'specializations', this.id(), 'procedures', 'new'] }
    }]);
  }

  openAddSpecializationDocumentPanel() {
    this.router.navigate([{
      outlets: { panel: ['panels', 'specializations', this.id(), 'spec-docs', 'new'] }
    }]);
  }

  selectTab(id: string) {
    this.activeTab.set(id);
    this.panelService.closePanel();
  }

  private getProcedures() {
    this.procedureService.getProcedures(this.id())
      .subscribe();
  }

  private getDocuments() {
    this.specializationDocumentService.getSpecializationDocuments(this.id())
      .subscribe();
  }
}
