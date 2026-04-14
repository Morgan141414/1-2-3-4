import {Component, input, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  selector: 'app-phone-input-field',
  imports: [
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: './phone-input-field.component.html',
  styleUrl: './phone-input-field.component.scss',
  standalone: true
})
export class PhoneInputFieldComponent implements OnInit{
  controlName = input.required<FormControl>();
  label = input<string>('Телефон');

  ngOnInit() {
    this.controlName().addValidators([Validators.pattern('^[0-9]{11}$')])
  }
}
