import {Component, inject, input, OnInit, output} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import {DoctorService} from '../../../core/services/doctor.service';
import {Doctor, UpdateDoctorRequest} from '../../../core/model/doctor.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {PhoneInputFieldComponent} from '../../../shared/components/phone-input-field/phone-input-field.component';
import {IinInputFieldComponent} from '../../../shared/components/iin-input-field/iin-input-field.component';
import {AuthService} from '../../../core/services/auth.service';
import {UserRoleType} from '../../../core/model/user.model';

@Component({
  selector: 'app-doctor-info',
  imports: [
    InputFieldComponent,
    PhoneInputFieldComponent,
    ReactiveFormsModule,
    IinInputFieldComponent
  ],
  templateUrl: './doctor-info.component.html',
  styleUrl: './doctor-info.component.scss',
  standalone: true
})
export class DoctorInfoComponent implements OnInit {
  private readonly doctorService = inject(DoctorService);
  private readonly router = inject(Router);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  protected readonly userRoleType = UserRoleType;
  role = this.authService.getRole();

  id = input.required<string>();
  doctor = input.required<Doctor>();
  updated = output<void>();

  form = new FormGroup({
    iin: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{12}$/)
    ]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    middleName: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl('', Validators.email)
  });

  ngOnInit() {
    this.form.enable()
    this.form.controls.iin.setValue(this.doctor().iin);
    this.form.controls.firstName.setValue(this.doctor().firstName);
    this.form.controls.lastName.setValue(this.doctor().lastName);
    this.form.controls.middleName.setValue(this.doctor().middleName || '');
    this.form.controls.phone.setValue(this.doctor().phone || '');
    this.form.controls.email.setValue(this.doctor().email || '');
    this.form.disable();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }
    this.form.disable();

    this.doctorService.updateDoctor(this.id(), this.form.value as UpdateDoctorRequest)
      .subscribe({
        next: () => {
          this.matSnackBar.open('Доктор обновлен', '', { panelClass: 'snackbar-success' });
          this.updated.emit();
        },
        error: () => this.form.enable()
      });
  }

  openEditUserPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'users', this.doctor().user.id, 'edit'] } }]);
  }
}
