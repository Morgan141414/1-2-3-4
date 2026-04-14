import {Component, inject, input, signal} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOption, MatSelect, MatSelectTrigger} from '@angular/material/select';
import {MatChip, MatChipRemove} from '@angular/material/chips';

import {Mkb10Service} from '../../../core/services/mkb10.service';
import {Mkb10} from '../../../core/model/mkb10.model';
import {ProtocolField} from '../../../core/model/protocol.model';
import {ProtocolDataFormSectionField} from '../../../core/model/protocol-data.model';

@Component({
  selector: 'app-protocol-mkb10-input-field',
  imports: [
    FormsModule,
    MatSelect,
    MatOption,
    MatSelectTrigger,
    MatChip,
    MatChipRemove,
    ReactiveFormsModule
  ],
  templateUrl: './protocol-mkb10-input-field.component.html',
  styleUrl: './protocol-mkb10-input-field.component.scss',
  standalone: true
})
export class ProtocolMkb10InputFieldComponent {
  private readonly mkb10Service = inject(Mkb10Service);
  field = input.required<ProtocolField>();
  control = input.required<FormGroup<ProtocolDataFormSectionField>>();

  mkb10Dictionary: Mkb10[] = [];
  compare = (a: Mkb10, b: Mkb10) => {
    if (!a || !b) return false;
    return a.key === b.key;
  };

  filteredItemList = signal<Mkb10[]>([]);
  search = signal('');

  constructor() {
    this.getMkb10Dictionary();
  }

  private getMkb10Dictionary() {
    this.mkb10Service.getMkb10Dictionary()
      .subscribe(resp => {
        this.mkb10Dictionary = resp;
        this.filteredItemList.set(resp);
      });
  }

  onChange() {
    const diagnosis = this.control().controls.diagnosis.value as Mkb10[];
    this.control().controls.value.setValue(
      diagnosis
        .map(mkb => mkb.name)
        .join(", ")
    );
  }

  onFilterChange() {
    const lowercasedSearch = this.search().toLowerCase();
    const list = this.mkb10Dictionary.filter(mkb =>
      mkb.key.toLowerCase().includes(lowercasedSearch) || mkb.name.toLowerCase().includes(lowercasedSearch)
    );
    this.filteredItemList.set(list);
  }

  clearSearch() {
    this.search.set('');
    this.filteredItemList.set(this.mkb10Dictionary)
  }

  removeDiagnosis(mkb: Mkb10) {
    const updatedList = (this.control().controls.diagnosis.value as Mkb10[])
      .filter(item => item !== mkb);
    this.control().controls.diagnosis.setValue(updatedList);
    this.onChange();
  }
}
