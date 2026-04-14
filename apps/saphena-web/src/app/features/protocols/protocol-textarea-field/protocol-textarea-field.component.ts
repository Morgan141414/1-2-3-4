import {ChangeDetectionStrategy, Component, inject, input, signal} from '@angular/core';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {finalize} from 'rxjs';

import {FieldTemplateService} from '../../../core/services/field-template.service';
import {ProtocolField} from '../../../core/model/protocol.model';
import {CreateFieldTemplateRequest, FieldTemplate} from '../../../core/model/field-template.model';

@Component({
  selector: 'app-protocol-textarea-field',
  imports: [
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinner
  ],
  templateUrl: './protocol-textarea-field.component.html',
  styleUrl: './protocol-textarea-field.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtocolTextareaFieldComponent {
  private readonly fieldTemplateService = inject(FieldTemplateService);
  control = input.required<FormControl>();
  field = input.required<ProtocolField>();
  procedureId = input<string>();
  templateName = signal('');
  templates = signal<FieldTemplate[]>([]);
  loading = signal(false);

  canSaveAsTemplate() {
    return this.control().value.length < 10 || this.templateName().length < 4;
  }

  save(event: MouseEvent) {
    event.stopPropagation();

    const request:  CreateFieldTemplateRequest = {
      documentId: this.procedureId()!,
      fieldKey: this.field().key,
      name: this.templateName(),
      content: this.control().value
    }
    this.fieldTemplateService.createFieldTemplate(request)
      .subscribe(_ => {
        this.templateName.set('');
        this.getTemplates();
      });
  }

  getTemplates() {
    this.loading.set(true);

    this.fieldTemplateService.getFieldTemplates(this.procedureId()!, this.field().key)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(resp => this.templates.set(resp));
  }

  onTemplateClicked(content: string) {
    this.control().setValue(content);
  }
}
