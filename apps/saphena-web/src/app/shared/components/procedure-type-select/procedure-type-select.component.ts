import {Component, input} from '@angular/core';
import {ProcedureType} from "../../../core/model/procedure.model";
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-procedure-type-select',
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './procedure-type-select.component.html',
  styleUrl: './procedure-type-select.component.scss',
  standalone: true
})
export class ProcedureTypeSelectComponent {
  controlName = input.required<FormControl>();
  protected readonly procedureType = ProcedureType;
}
