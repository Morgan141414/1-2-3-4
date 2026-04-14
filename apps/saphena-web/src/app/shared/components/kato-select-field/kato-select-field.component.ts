import {Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {Kato, KATO_LIST} from '../../../core/model/kato.model';

@Component({
  selector: 'app-kato-select-field',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './kato-select-field.component.html',
  styleUrl: './kato-select-field.component.scss',
  standalone: true
})
export class KatoSelectFieldComponent {
  protected readonly KATO_LIST = KATO_LIST;
  control = input.required<FormControl>();

  compare = (a: Kato, b: Kato) => a.code === b.code;

}
