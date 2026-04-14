import {Component, input, OnChanges, OnInit, signal} from '@angular/core';
import {ProtocolField} from '../../../core/model/protocol.model';
import {
  FormControl, FormGroup, FormsModule, ReactiveFormsModule,
} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-protocol-checkbox-field',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './protocol-checkbox-field.component.html',
  styleUrl: './protocol-checkbox-field.component.scss',
  standalone: true
})
export class ProtocolCheckboxFieldComponent implements OnInit {
  field = input.required<ProtocolField>();
  control = input.required<FormControl>();

  selected = signal<string[]>([]);

  ngOnInit() {
    this.selected.set(this.control().value.split(';'));
  }

  onChange(event: any) {
    const value = event.target.value;

    if (event.target.checked) {
      this.selected.update(arr => [...arr, value]);
    } else {
      this.selected.update(arr => arr.filter(v => v !== value));
    }

    this.control().setValue(
      this.selected()
        .filter(v => !!v)
        .join('; ')
    );
  }

}
