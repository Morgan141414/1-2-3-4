import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {CreateFieldTemplateRequest, FieldTemplate} from '../model/field-template.model';

@Injectable({
  providedIn: 'root'
})
export class FieldTemplateService {
  private readonly http = inject(HttpClient);

  getFieldTemplates(documentId: string, fieldKey: string) {
    return this.http.get<FieldTemplate[]>(`/api/field-templates?documentId=${documentId}&fieldKey=${fieldKey}`);
  }

  createFieldTemplate(request: CreateFieldTemplateRequest) {
    return this.http.post<void>(`/api/field-templates`, request);
  }

}
