import {Component, inject, input, OnInit, output} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';

import {DoctorProcedureService} from '../../../core/services/doctor-procedure.service';
import {DoctorProcedure} from '../../../core/model/doctor-procedure.model';
import {ProcedureType} from '../../../core/model/procedure.model';

@Component({
  selector: 'app-active-doctor-procedure',
  imports: [
    NgClass,
    FormsModule,
    NgxMaskDirective,
    ReactiveFormsModule
  ],
  templateUrl: './active-doctor-procedure.component.html',
  styleUrl: './active-doctor-procedure.component.scss',
  standalone: true
})
export class ActiveDoctorProcedureComponent implements OnInit {
  private readonly doctorProcedureService = inject(DoctorProcedureService);
  protected readonly procedureType = ProcedureType;
  doctorProcedure = input.required<DoctorProcedure>();
  updated = output<void>();

  price = new FormControl(0, Validators.required);

  ngOnInit() {
    this.price.setValue(this.doctorProcedure().price || 0);
    this.price.disable();
  }

  removeProcedure(id: string) {
    this.doctorProcedureService.removeDoctorProcedure(id)
      .subscribe(() => this.updated.emit());
  }

  updatePrice() {
    if (this.price.invalid) {
      this.price.markAsTouched();
      return;
    }

    this.doctorProcedureService.setPrice(this.doctorProcedure().id, this.price.value!)
      .subscribe(() => {
        this.price.disable();
        this.updated.emit();
      });
  }

  cancel() {
    this.price.setValue(this.doctorProcedure().price || 0);
    this.price.disable();
  }
}
