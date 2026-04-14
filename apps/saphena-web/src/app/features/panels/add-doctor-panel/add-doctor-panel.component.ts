import {Component, inject, signal} from '@angular/core';
import {FormControl, FormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgxMaskPipe} from 'ngx-mask';
import {switchMap} from 'rxjs';

import {DoctorService} from '../../../core/services/doctor.service';
import {PanelService} from '../../../core/services/panel.service';
import {Doctor} from '../../../core/model/doctor.model';
import {IinInputFieldComponent} from '../../../shared/components/iin-input-field/iin-input-field.component';

@Component({
  selector: 'app-add-doctor-panel',
  imports: [
    IinInputFieldComponent,
    FormsModule,
    NgxMaskPipe
  ],
  templateUrl: './add-doctor-panel.component.html',
  styleUrl: './add-doctor-panel.component.scss',
  standalone: true
})
export class AddDoctorPanelComponent {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly doctorService = inject(DoctorService);
  private readonly panelService = inject(PanelService);

  iin = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{12}$/)
  ]);
  doctor = signal<Doctor | null>(null);

  onIinFilled() {
    this.doctorService.getDoctorByIin(this.iin.value!)
      .subscribe(resp => {
        if (resp) {
          this.doctor.set(resp);
        } else {
          this.matSnackBar.open('Доктор не найден');
        }
      });
  }


  addDoctor() {
    this.iin.disable();

    this.doctorService.addDoctorToOrganization(this.doctor()!.id)
      .pipe(
        switchMap(() => this.doctorService.getDoctors()),
      )
      .subscribe(() => {
        this.matSnackBar.open('Доктор добавлен', '', { panelClass: 'snackbar-success' });
        this.panelService.closePanel();
      })
  }

}
