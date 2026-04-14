import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AssistantService} from '../../../core/services/assistant.service';
import {AssistantTableComponent} from '../../assistants/assistant-table/assistant-table.component';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';
import {AssistantType} from '../../../core/model/assistant.model';
import {getAssistantTypeName} from '../../../shared/utils/name.util';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-assistant-list-page',
  imports: [
    AssistantTableComponent,
    PaginationComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './assistant-list-page.component.html',
  styleUrl: './assistant-list-page.component.scss',
  standalone: true
})
export class AssistantListPageComponent implements OnInit, OnDestroy {
  private readonly assistantService = inject(AssistantService);
  private readonly router = inject(Router);

  protected readonly assistantType = AssistantType;
  protected readonly getAssistantTypeName = getAssistantTypeName;

  assistantsPage = this.assistantService.assistantsPage;
  type = this.assistantService.selectedType;

  ngOnInit() {
    this.getAssistants();
  }

  ngOnDestroy() {
    this.assistantService.clearState();
  }

  getAssistants(page?: number) {
    this.assistantService.getAssistants({ page })
      .subscribe();
  }

  openAddAssistantPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'assistants', 'new'] } }]);
  }

  openEditAssistantPanel(id: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'assistants', id, 'edit'] } }]);
  }
}
