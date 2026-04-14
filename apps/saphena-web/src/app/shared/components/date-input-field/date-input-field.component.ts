import {Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-date-input-field',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './date-input-field.component.html',
  styleUrl: './date-input-field.component.scss',
  standalone: true
})
export class DateInputFieldComponent {
  controlName = input.required<FormControl>();
  label = input<string>('Дата');
}
