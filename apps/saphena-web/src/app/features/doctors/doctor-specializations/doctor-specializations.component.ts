import {Component, computed, inject, input, linkedSignal, OnInit, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {DoctorProcedureListComponent} from '../doctor-procedure-list/doctor-procedure-list.component';
import {DoctorSpecializationService} from '../../../core/services/doctor-specialization.service';
import {Specialization} from '../../../core/model/specialization.model';
import {AddDoctorSpecializationRequest, DoctorSpecialization} from '../../../core/model/doctor-specialization.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-doctor-specializations',
  imports: [
    FormsModule,
    DoctorProcedureListComponent,
    NgClass
  ],
  templateUrl: './doctor-specializations.component.html',
  styleUrl: './doctor-specializations.component.scss',
  standalone: true
})
export class DoctorSpecializationsComponent implements OnInit {
  private readonly doctorSpecializationService = inject(DoctorSpecializationService);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  orgUserId = input.required<string>();
  specializations = input.required<Specialization[]>();

  doctorSpecializations = signal<DoctorSpecialization[]>([]);
  selectedSpecializationId = linkedSignal(() => this.availableSpecializations()[0]?.id);
  activeDoctorSpecializationTab = linkedSignal(() => this.doctorSpecializations()[0]);

  availableSpecializations = computed<Specialization[]>(() => {
    return this.specializations()
      .filter(s => !this.doctorSpecializations().some(ds => s.id === ds.specialization.id))
  });

  ngOnInit() {
    this.getDoctorSpecializations();
  }

  getDoctorSpecializations() {
    this.doctorSpecializationService.getDoctorSpecializationsByOrgUserId(this.orgUserId())
      .subscribe((resp) => this.doctorSpecializations.set(resp))
  }

  addSpecialization() {
    this.doctorSpecializationService.addDoctorSpecialization(
      {
        specializationId: this.selectedSpecializationId(),
        orgUserId: this.orgUserId()
      } as AddDoctorSpecializationRequest)
      .subscribe(() => {
        this.matSnackBar.open('Специализация добавлена', '', { panelClass: 'snackbar-success' });
        this.getDoctorSpecializations();
      });
  }

  removeSpecialization() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: this.activeDoctorSpecializationTab().specialization.name, subtitle: 'Вы уверены что хотите удалить специализацию?'  }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.doctorSpecializationService.removeDoctorSpecialization(this.activeDoctorSpecializationTab().id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Специализация удалена', '', { panelClass: 'snackbar-success' });
                this.getDoctorSpecializations();
              }
            })
        }
      })
  }

  changeTab(docSpec: DoctorSpecialization) {
    this.activeDoctorSpecializationTab.set(docSpec);
  }
}
