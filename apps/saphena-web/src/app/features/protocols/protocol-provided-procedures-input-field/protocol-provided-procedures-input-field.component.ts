import {Component, input, OnInit} from '@angular/core';
import {FormControl, FormsModule, Validators} from '@angular/forms';

import {ProvidedProcedure} from '../../../core/model/protocol-data.model';
import {ProtocolField} from '../../../core/model/protocol.model';

@Component({
  selector: 'app-protocol-provided-procedures-input-field',
  imports: [
    FormsModule
  ],
  templateUrl: './protocol-provided-procedures-input-field.component.html',
  styleUrl: './protocol-provided-procedures-input-field.component.scss',
  standalone: true
})
export class ProtocolProvidedProceduresInputFieldComponent {
  field = input.required<ProtocolField>();
  control = input.required<FormControl>();

  addProcedure() {
    this.control().value.push({
      name: '',
      number: 1,
      cost: 0,
      totalCost: 0
    })
  }

  removeProcedure(procedureIndex: number) {
    this.control().value.splice(procedureIndex, 1);
  }
}
