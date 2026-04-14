import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {NgClass} from '@angular/common';

import {OrganizationDocumentService} from '../../../core/services/organization-document.service';
import {ProtocolService} from '../../../core/services/protocol.service';
import {ProtocolTargetType} from '../../../core/model/protocol.model';
import {OrganizationDocument} from '../../../core/model/organization-document.model';

@Component({
  selector: 'app-organization-documents-panel',
  imports: [
    NgClass
  ],
  templateUrl: './organization-documents-panel.component.html',
  styleUrl: './organization-documents-panel.component.scss',
  standalone: true
})
export class OrganizationDocumentsPanelComponent implements OnInit, OnDestroy {
  private readonly organizationDocumentService = inject(OrganizationDocumentService);
  private readonly protocolService = inject(ProtocolService);

  organizationDocuments = signal<OrganizationDocument[]>([]);
  activeDocId = signal('');

  ngOnInit() {
    this.getOrganizationDocuments();
  }

  ngOnDestroy() {
    this.protocolService.clearState();
  }

  selectDocument(id: string) {
    if (this.activeDocId() === id) {
      return;
    }

    this.activeDocId.set(id);
    this.protocolService.clearState();
    this.protocolService.getActiveProtocol(
      ProtocolTargetType.ORG_DOC,
      id,
    )
      .subscribe();
  }

  private getOrganizationDocuments() {
    return this.organizationDocumentService.getOrgDocCatalog()
      .subscribe(resp => this.organizationDocuments.set(resp));
  }

}
