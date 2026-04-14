import {Component, inject, input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, map, switchMap, tap} from 'rxjs';

import {DoctorService} from '../../../core/services/doctor.service';
import {PanelService} from '../../../core/services/panel.service';
import {UpdateDoctorRequest} from '../../../core/model/doctor.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';

@Component({
  selector: 'app-edit-doctor-panel',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    PhoneInputFieldComponent
  ],
  templateUrl: './edit-doctor-panel.component.html',
  styleUrl: './edit-doctor-panel.component.scss',
  standalone: true
})
export class EditDoctorPanelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly doctorService = inject(DoctorService);
  private readonly panelService = inject(PanelService);
  id = input.required<string>();

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    middleName: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl('', Validators.email)
  });


  ngOnInit() {
    this.route.params
      .pipe(
        tap(() => this.form.disable()),
        map(params => params["id"]),
        switchMap(id => this.doctorService.getDoctor(id))
      )
      .subscribe(resp => {
        this.form.controls.firstName.setValue(resp.firstName);
        this.form.controls.lastName.setValue(resp.lastName);
        this.form.controls.middleName.setValue(resp.middleName || '');
        this.form.controls.phone.setValue(resp.phone || '');
        this.form.controls.email.setValue(resp.email || '')
        this.form.enable();
      })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.doctorService.updateDoctor(this.id(), this.form.value as UpdateDoctorRequest)
      .pipe(
        switchMap(() => this.doctorService.getDoctors()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Доктор обновлен', '', { panelClass: 'snackbar-success' });
          this.panelService.closePanel();
        }
      })
  }

}
