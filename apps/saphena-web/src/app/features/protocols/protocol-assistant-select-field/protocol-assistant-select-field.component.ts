import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';

import {AssistantService} from '../../../core/services/assistant.service';
import {Assistant} from '../../../core/model/assistant.model';
import {ProtocolField} from '../../../core/model/protocol.model';
import {getAssistantTypeName, getFullname} from '../../../shared/utils/name.util';
import {ProtocolDataFormSectionField} from '../../../core/model/protocol-data.model';

@Component({
  selector: 'app-protocol-assistant-select-field',
  imports: [
    MatSelect,
    MatOption,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './protocol-assistant-select-field.component.html',
  styleUrl: './protocol-assistant-select-field.component.scss',
  standalone: true
})
export class ProtocolAssistantSelectFieldComponent implements OnInit {
  private readonly assistantService = inject(AssistantService);
  protected readonly getFullname = getFullname;
  protected readonly getAssistantTypeName = getAssistantTypeName;
  field = input.required<ProtocolField>();
  control = input.required<FormGroup<ProtocolDataFormSectionField>>();

  assistants = signal<Assistant[]>([]);

  ngOnInit() {
    this.getAssistants();
  }

  assistantFullname(assistant: Assistant) {
    return getFullname(assistant.firstName, assistant.lastName, assistant.middleName);
  }

  private getAssistants() {
    this.assistantService.getAssistantList(this.field().assistantType!)
      .subscribe(resp => this.assistants.set(resp));
  }

  onChange() {
    const selectedAssistants = this.control().controls.assistantIds.value as string[];
    const assistantNames = this.assistants()
      .filter(a => selectedAssistants.includes(a.id))
      .map(a => getFullname(a.firstName, a.lastName, a.middleName))
      .join(", ");

    this.control().controls.value.setValue(assistantNames);
  }
}
