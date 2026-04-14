import {Component, input, output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-doc-number-input-field',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './doc-number-input-field.component.html',
  styleUrl: './doc-number-input-field.component.scss',
  standalone: true
})
export class DocNumberInputFieldComponent {
  controlName = input.required<FormControl>();
  filled = output<void>();

  onInput() {
    if (this.controlName().valid) {
      this.filled.emit();
    }
  }
}
