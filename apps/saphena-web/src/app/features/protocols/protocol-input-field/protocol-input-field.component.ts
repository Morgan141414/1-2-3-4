import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ProtocolField, ProtocolFieldType} from '../../../core/model/protocol.model';

@Component({
  selector: 'app-protocol-input-field',
  imports: [
    FormsModule,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './protocol-input-field.component.html',
  styleUrl: './protocol-input-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ProtocolInputFieldComponent {
  protected readonly protocolFieldType = ProtocolFieldType;
  control = input.required<FormControl>();
  field = input.required<ProtocolField>();
  sectionIndex = input.required<number>();
  fieldIndex = input.required<number>();

}
