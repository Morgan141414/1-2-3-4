import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {Assistant, AssistantType, CreateAssistantRequest, UpdateAssistantRequest} from '../model/assistant.model';
import {Page, Pageable} from '../model/page.model';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private readonly http = inject(HttpClient);

  #assistantsPage = signal<Page<Assistant>>({} as Page<Assistant>);

  assistantsPage = this.#assistantsPage.asReadonly();
  selectedType = signal('');

  getAssistants(pageable?: Pageable) {
    return this.http.get<Page<Assistant>>(`/api/assistants`,
      { params: { ...pageable, type: this.selectedType() } })
      .pipe(
        tap(resp => this.#assistantsPage.set(resp))
      );
  }

  getAssistant(id: string) {
    return this.http.get<Assistant>(`/api/assistants/${id}`);
  }

  createAssistant(req: CreateAssistantRequest) {
    return this.http.post<void>(`/api/assistants`, req);
  }

  updateAssistant(id: string, req: UpdateAssistantRequest) {
    return this.http.put<void>(`/api/assistants/${id}`, req);
  }

  getAssistantList(type: AssistantType) {
    return this.http.get<Assistant[]>(`/api/assistants/list?type=${type}`);
  }

  deleteAssistant(id: string) {
    return this.http.delete<void>(`/api/assistants/${id}`);
  }

  activateAssistant(id: string) {
    return this.http.post<void>(`/api/assistants/${id}/activate`, null);
  }

  clearState() {
    this.#assistantsPage.set({} as Page<Assistant>);
    this.selectedType.set('');
  }
}
