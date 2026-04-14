import {Component, inject, input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize, map, switchMap, tap} from 'rxjs';

import {PanelService} from '../../../core/services/panel.service';
import {PatientService} from '../../../core/services/patient.service';
import {GenderType, UpdatePatientRequest} from '../../../core/model/patient.model';
import {Kato, KATO_LIST} from '../../../core/model/kato.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';
import {DateInputFieldComponent} from '../../../shared/components/date-input-field/date-input-field.component';
import {KatoSelectFieldComponent} from '../../../shared/components/kato-select-field/kato-select-field.component';

@Component({
  selector: 'app-edit-patient-panel',
  imports: [
    InputFieldComponent,
    PhoneInputFieldComponent,
    ReactiveFormsModule,
    DateInputFieldComponent,
    KatoSelectFieldComponent
  ],
  templateUrl: './edit-patient-panel.component.html',
  styleUrl: './edit-patient-panel.component.scss',
  standalone: true
})
export class EditPatientPanelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly panelService = inject(PanelService);
  private readonly patientService = inject(PatientService);
  protected readonly genderType = GenderType;
  id = input.required<string>();

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    middleName: new FormControl(''),
    gender: new FormControl(GenderType.MALE),
    birthdate: new FormControl('', Validators.required),
    city: new FormControl<Kato>(KATO_LIST[0]),
    address: new FormControl(''),
    phone: new FormControl(''),
    emergencyContact: new FormControl(''),
    email: new FormControl('', Validators.email)
  });

  ngOnInit() {
    this.route.params
      .pipe(
        tap(() => this.form.disable()),
        map(params => params["id"]),
        switchMap(id => this.patientService.getPatient(id))
      )
      .subscribe(resp => {
        this.form.controls.firstName.setValue(resp.firstName);
        this.form.controls.lastName.setValue(resp.lastName);
        this.form.controls.middleName.setValue(resp.middleName || '');
        this.form.controls.gender.setValue(resp.gender);
        this.form.controls.birthdate.setValue(resp.birthdate || '');
        this.form.controls.city.setValue(resp.city || KATO_LIST[0]);
        this.form.controls.address.setValue(resp.address || '');
        this.form.controls.phone.setValue(resp.phone || '');
        this.form.controls.emergencyContact.setValue(resp.emergencyContact || '');
        this.form.controls.email.setValue(resp.email || '');
        this.form.enable();
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.patientService.updatePatient(this.id(), this.form.value as UpdatePatientRequest)
      .pipe(
        switchMap(() => this.patientService.getPatients()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Пациент обновлен', '', { panelClass: 'snackbar-success' });
          this.panelService.closePanel();
        }
      })
  }

}
