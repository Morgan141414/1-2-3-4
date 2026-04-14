import {Component, inject, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs';

import {DoctorSettingsService} from '../../../core/services/doctor-settings.service';
import {DoctorSettingsRequest} from '../../../core/model/doctor-settings.model';

@Component({
  selector: 'app-doctor-settings',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './doctor-settings.component.html',
  styleUrl: './doctor-settings.component.scss',
  standalone: true
})
export class DoctorSettingsComponent implements OnInit {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly doctorSettingsService = inject(DoctorSettingsService);
  orgUserId = input.required<string>();

  form = new FormGroup({
    doctorClientRatio: new FormControl<number | null>(null, Validators.required),
    clinicClientRatio: new FormControl<number | null>(null, Validators.required),
  })

  ngOnInit() {
    this.getDoctorSettings();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.doctorSettingsService.createOrUpdateDoctorSettings(
      this.orgUserId(),
      this.form.value as DoctorSettingsRequest
    )
      .pipe(
        finalize(() => this.form.enable())
      )
      .subscribe(_ => {
        this.matSnackBar.open('Настройки обновлены', '', {panelClass: 'snackbar-success'});
        this.getDoctorSettings();
      });
  }

  private getDoctorSettings() {
    this.doctorSettingsService.getDoctorSettings(this.orgUserId())
      .subscribe(resp => {
        if (resp !== null) {
          this.form.controls.doctorClientRatio.setValue(resp.doctorClientRatio);
          this.form.controls.clinicClientRatio.setValue(resp.clinicClientRatio);
        }
      });
  }
}
