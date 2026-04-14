import {Component, input} from '@angular/core';
import {ProtocolField} from '../../../core/model/protocol.model';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProtocolDataFormSectionField} from '../../../core/model/protocol-data.model';

@Component({
  selector: 'app-protocol-range-input-field',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './protocol-range-input-field.component.html',
  styleUrl: './protocol-range-input-field.component.scss',
  standalone: true
})
export class ProtocolRangeInputFieldComponent {
  field = input.required<ProtocolField>();
  control = input.required<FormGroup<ProtocolDataFormSectionField>>();

}
