import {Component, inject, input, OnChanges, signal} from '@angular/core';


import {AssistantService} from '../../../core/services/assistant.service';
import {Assistant} from '../../../core/model/assistant.model';
import {ProtocolData, ProtocolFieldData} from '../../../core/model/protocol-data.model';
import {ProtocolFieldType} from '../../../core/model/protocol.model';
import {getAssistantTypeName, getFullname} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-protocol-data',
  imports: [],
  templateUrl: './protocol-data.component.html',
  styleUrl: './protocol-data.component.scss',
  standalone: true
})
export class ProtocolDataComponent implements OnChanges {
  private readonly assistantService = inject(AssistantService);
  protected readonly protocolFieldType = ProtocolFieldType;
  protected readonly getFullname = getFullname;
  protected readonly getAssistantTypeName = getAssistantTypeName;
  protocolData = input.required<ProtocolData>();

  assistant = signal<Assistant | null>(null);

  ngOnChanges() {
    if (this.protocolData().doctorAssistantId) {
      this.assistantService.getAssistant(this.protocolData().doctorAssistantId!)
        .subscribe(resp => this.assistant.set(resp));
    }
  }

  getRangeValue(field: ProtocolFieldData) {
    if (field.from && field.to) {
      return `от ${field.from} до ${field.to} ${field.unit}`;
    }
    else if (field.from) {
      return `от ${field.from} ${field.unit}`;
    }
    else if (field.to) {
      return `до ${field.to} ${field.unit}`;
    }
    return "";
  }

  cellKey(rowKey: string, columnKey: string): string {
    return `${rowKey}:${columnKey}`;
  }

}
