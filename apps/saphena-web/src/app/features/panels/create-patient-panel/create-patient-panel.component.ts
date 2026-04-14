import {Component, computed, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {filter, finalize, switchMap, tap} from 'rxjs';

import {PatientService} from '../../../core/services/patient.service';
import {PanelService} from '../../../core/services/panel.service';
import {CreatePatientRequest, GenderType, PatientDocumentType} from '../../../core/model/patient.model';
import {Kato, KATO_LIST} from '../../../core/model/kato.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';
import {DateInputFieldComponent} from '../../../shared/components/date-input-field/date-input-field.component';
import {IinInputFieldComponent} from '../../../shared/components/iin-input-field/iin-input-field.component';
import {KatoSelectFieldComponent} from '../../../shared/components/kato-select-field/kato-select-field.component';
import {getPatientDocumentTypeName} from '../../../shared/utils/name.util';
import {
  DocNumberInputFieldComponent
} from '../../../shared/components/doc-number-input-field/doc-number-input-field.component';

@Component({
  selector: 'app-create-patient-panel',
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    PhoneInputFieldComponent,
    DateInputFieldComponent,
    IinInputFieldComponent,
    KatoSelectFieldComponent,
    DocNumberInputFieldComponent,
  ],
  templateUrl: './create-patient-panel.component.html',
  styleUrl: './create-patient-panel.component.scss',
  standalone: true
})
export class CreatePatientPanelComponent {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly patientService = inject(PatientService);
  private readonly panelService = inject(PanelService);
  protected readonly genderType = GenderType;
  protected readonly patientDocumentType = PatientDocumentType;
  protected readonly getPatientDocumentTypeName = getPatientDocumentTypeName;
  protected readonly documentTypes = Object.values(PatientDocumentType);

  form = new FormGroup({
    isCitizen: new FormControl(true, Validators.required),
    documentType: new FormControl(PatientDocumentType.ID_CARD),
    iin: new FormControl('', [
      Validators.pattern(/^\d{12}$/),
      Validators.required
    ]),
    documentNumber: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(20)
    ]),
    issuedAt: new FormControl(''),
    expiresAt: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    middleName: new FormControl(''),
    gender: new FormControl(GenderType.MALE, Validators.required),
    birthdate: new FormControl('', Validators.required),
    city: new FormControl<Kato>(KATO_LIST[0]),
    address: new FormControl(''),
    phone: new FormControl(''),
    emergencyContact: new FormControl(''),
    email: new FormControl('', Validators.email)
  });

  constructor() {
    this.form.controls.isCitizen.valueChanges
      .subscribe(isCitizen => {
        const iinControl = this.form.controls.iin;
        const documentNumberControl = this.form.controls.documentNumber;
        const documentTypeControl = this.form.controls.documentType;
        if (isCitizen) {
          documentTypeControl.setValue(PatientDocumentType.ID_CARD);
          iinControl.enable();
          iinControl.setValidators([
            Validators.required,
            Validators.pattern(/^\d{12}$/)
          ]);
          documentNumberControl.clearValidators();
        } else {
          documentTypeControl.setValue(PatientDocumentType.PASSPORT);
          documentNumberControl.setValidators([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]);
          iinControl.disable();
          iinControl.clearValidators();
        }
        iinControl.updateValueAndValidity();
        documentNumberControl.updateValueAndValidity();
      });
  }

  onIinFilled() {
    this.patientService.checkPatientExistByIin(this.form.controls.iin.value!)
      .pipe(
        filter(exists => exists),
        tap(() => {
          this.matSnackBar.open('Пациент уже добавлен', '', {panelClass: 'snackbar-success'});
          this.patientService.search.set(this.form.controls.iin.value!);
        }),
        switchMap(() => this.patientService.getPatients())
      )
      .subscribe()
  }

  onDocNumberFilled() {
    this.patientService.checkPatientExistByDocNumber(
      this.form.controls.documentNumber.value!,
      this.form.controls.documentType.value!
    )
      .pipe(
        filter(exists => exists),
        tap(() => {
          this.matSnackBar.open('Пациент уже добавлен', '', {panelClass: 'snackbar-success'});
          this.patientService.search.set(this.form.controls.documentNumber.value!);
        }),
        switchMap(() => this.patientService.getPatients())
      )
      .subscribe()
  }

  onSubmit() {
    const req = this.form.value as CreatePatientRequest;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;

    }
    this.form.disable();

    this.patientService.createPatient(req)
      .pipe(
        tap(() => this.patientService.search.set('')),
        switchMap(() => this.patientService.getPatients()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Пациент добавлен', '', { panelClass: 'snackbar-success' });
          this.panelService.closePanel();
        }
      })
  }

}
