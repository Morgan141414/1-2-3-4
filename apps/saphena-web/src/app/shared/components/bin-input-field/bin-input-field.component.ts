import {Component, input, output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-bin-input-field',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './bin-input-field.component.html',
  styleUrl: './bin-input-field.component.scss',
  standalone: true
})
export class BinInputFieldComponent {
  controlName = input.required<FormControl>();
  filled = output<void>();

  onInput() {
    if (this.controlName().valid) {
      this.filled.emit();
    }
  }

}
