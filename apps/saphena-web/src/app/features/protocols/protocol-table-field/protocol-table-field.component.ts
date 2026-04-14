import {Component, input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {NgClass} from '@angular/common';

import {ProtocolDataFormSectionField} from '../../../core/model/protocol-data.model';
import {ProtocolField} from '../../../core/model/protocol.model';

@Component({
  selector: 'app-protocol-table-field',
  imports: [
    NgClass
  ],
  templateUrl: './protocol-table-field.component.html',
  styleUrl: './protocol-table-field.component.scss',
  standalone: true
})
export class ProtocolTableFieldComponent {
  field = input.required<ProtocolField>();
  control = input.required<FormGroup<ProtocolDataFormSectionField>>();

  cellKey(rowKey: string, columnKey: string): string {
    return `${rowKey}:${columnKey}`;
  }

  onCellInput(rowKey: string, columnKey: string, value: string): void {
    const key = this.cellKey(rowKey, columnKey);
    const tableDataCtrl = this.control().controls.tableData;

    tableDataCtrl.patchValue({
      ...tableDataCtrl.value,
      [key]: value
    });
  }

}
