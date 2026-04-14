import {Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-input-field',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
  standalone: true
})
export class InputFieldComponent {
  label = input.required();
  controlName = input.required<FormControl>();
  placeholder = input('Введите данные');
}
