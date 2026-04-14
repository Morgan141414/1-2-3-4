import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, switchMap} from 'rxjs';

import {DoctorService} from '../../../core/services/doctor.service';
import {PanelService} from '../../../core/services/panel.service';
import {CreateDoctorRequest, Doctor} from '../../../core/model/doctor.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';
import {IinInputFieldComponent} from '../../../shared/components/iin-input-field/iin-input-field.component';

@Component({
  selector: 'app-create-doctor-panel',
  imports: [
    InputFieldComponent,
    ReactiveFormsModule,
    PhoneInputFieldComponent,
    IinInputFieldComponent
  ],
  templateUrl: './create-doctor-panel.component.html',
  styleUrl: './create-doctor-panel.component.scss',
  standalone: true
})
export class CreateDoctorPanelComponent implements OnInit {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly doctorService = inject(DoctorService);
  private readonly panelService = inject(PanelService);

  iin = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{12}$/)
  ]);
  personalInfoForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    middleName: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl('', Validators.email)
  });
  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  isNewDoctor = signal(false);
  doctorId = signal('');

  ngOnInit() {
    this.personalInfoForm.disable();
  }

  onIinFilled() {
    this.doctorService.getDoctorByIin(this.iin.value!)
      .subscribe(doctor => {
        this.setPersonalInfoForm(doctor);

        if (doctor) {
          this.isNewDoctor.set(false);
          this.doctorId.set(doctor.id);
        } else {
          this.isNewDoctor.set(true);
          this.doctorId.set('');
          this.personalInfoForm.enable();
        }
      });

  }

  createDoctor() {
    if (this.personalInfoForm.invalid || this.userForm.invalid) {
      this.personalInfoForm.markAllAsTouched();
      this.userForm.markAllAsTouched();
      return;
    }
    this.iin.disable();
    this.personalInfoForm.disable();
    this.userForm.disable();

    this.doctorService.createDoctor({
      iin: this.iin.value,
      user: this.userForm.value,
      ...this.personalInfoForm.value
    } as CreateDoctorRequest)
      .pipe(
        switchMap(() => this.doctorService.getDoctors()),
        finalize(() => {
          this.iin.enable();
          this.personalInfoForm.enable();
          this.userForm.enable();
        })
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Доктор добавлен', '', { panelClass: 'snackbar-success' });
          this.panelService.closePanel();
        }
      })
  }

  private setPersonalInfoForm(doctor?: Doctor) {
    this.personalInfoForm.controls.firstName.setValue(doctor?.firstName || '');
    this.personalInfoForm.controls.lastName.setValue(doctor?.lastName || '');
    this.personalInfoForm.controls.middleName.setValue(doctor?.middleName || '');
    this.personalInfoForm.controls.phone.setValue(doctor?.phone || '');
    this.personalInfoForm.controls.email.setValue(doctor?.email || '');
  }
}
