import {Component, input, output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-date-time-input-field',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './date-time-input-field.component.html',
  styleUrl: './date-time-input-field.component.scss',
  standalone: true
})
export class DateTimeInputFieldComponent {
  label = input('Дата и время');
  controlName = input.required<FormControl>();
  changed = output<void>();

}
