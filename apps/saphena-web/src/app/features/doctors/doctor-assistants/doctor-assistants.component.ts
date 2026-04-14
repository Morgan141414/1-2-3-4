import {Component, computed, inject, input, linkedSignal, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {forkJoin} from 'rxjs';

import {DoctorAssistantService} from '../../../core/services/doctor-assistant.service';
import {AssistantService} from '../../../core/services/assistant.service';
import {AuthService} from '../../../core/services/auth.service';
import {Assistant, AssistantType} from '../../../core/model/assistant.model';
import {UserRoleType} from '../../../core/model/user.model';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {AddDoctorAssistantRequest, DoctorAssistant} from '../../../core/model/doctor-assistant.model';
import {LeadingZerosPipe} from '../../../shared/pipes/leading-zeros.pipe';
import {getFullname} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-doctor-assistants',
  imports: [
    FormsModule,
    LeadingZerosPipe
  ],
  templateUrl: './doctor-assistants.component.html',
  styleUrl: './doctor-assistants.component.scss',
  standalone: true
})
export class DoctorAssistantsComponent implements OnInit {
  private readonly doctorAssistantService = inject(DoctorAssistantService);
  private readonly assistantService = inject(AssistantService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  protected readonly userRoleType = UserRoleType;

  role = this.authService.getRole();
  id = input.required<string>();
  orgUserId = input.required<string>();

  organizationAssistants = signal<Assistant[]>([]);
  doctorAssistants = signal<DoctorAssistant[]>([]);
  availableAssistants = computed<Assistant[]>(() => {
    return this.organizationAssistants()
      .filter(oa => !this.doctorAssistants().some(da => oa.id === da.assistant.id))
  })
  selectedAssistant = linkedSignal(() => this.availableAssistants()[0]?.id)

  ngOnInit() {
    this.getAssistants();
  }

  fullname(assistant: Assistant) {
    return getFullname(assistant.firstName, assistant.lastName, assistant.middleName);
  }

  private getAssistants() {
    forkJoin({
      organization: this.assistantService.getAssistantList(AssistantType.DOCTOR_ASSISTANT),
      doctor: this.doctorAssistantService.getDoctorAssistants(this.orgUserId()),
    }).subscribe(({ organization, doctor }) => {
      this.organizationAssistants.set(organization);
      this.doctorAssistants.set(doctor);
    });
  }

  addAssistant() {
    this.doctorAssistantService.addAssistantToDoctor({
      doctorId: this.id(),
      assistantId: this.selectedAssistant(),
      orgUserId: this.orgUserId()
    } as AddDoctorAssistantRequest)
      .subscribe(() => {
        this.matSnackBar.open('Ассистент добавлен', '', { panelClass: 'snackbar-success' });
        this.getAssistants();
      });
  }

  openDeleteDialog(docAssistant: DoctorAssistant) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: this.fullname(docAssistant.assistant), subtitle: 'Вы уверены что хотите удалить ассистента?'  }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.doctorAssistantService.removeDoctorAssistant(docAssistant.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Ассистент удален', '', { panelClass: 'snackbar-success' });
                this.getAssistants();
              }
            })
        }
      })
  }
}
