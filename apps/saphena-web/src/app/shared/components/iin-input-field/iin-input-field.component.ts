import {Component, input, output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-iin-input-field',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './iin-input-field.component.html',
  styleUrl: './iin-input-field.component.scss',
  standalone: true
})
export class IinInputFieldComponent {
  controlName = input.required<FormControl>();
  filled = output<void>();

  onInput() {
    if (this.controlName().valid) {
      this.filled.emit();
    }
  }

}
