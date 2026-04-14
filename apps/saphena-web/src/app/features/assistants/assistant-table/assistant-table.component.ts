import {Component, inject, input, output} from '@angular/core';
import {NgClass} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {AssistantService} from '../../../core/services/assistant.service';
import {Assistant} from '../../../core/model/assistant.model';
import {getAssistantTypeName, getFullname} from '../../../shared/utils/name.util';
import {
  ConfirmationDialogComponent
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-assistant-table',
  imports: [
    NgClass
  ],
  templateUrl: './assistant-table.component.html',
  styleUrl: './assistant-table.component.scss',
  standalone: true
})
export class AssistantTableComponent {
  private readonly assistantService = inject(AssistantService);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);

  protected readonly getAssistantTypeName = getAssistantTypeName;
  protected readonly getFullname = getFullname;

  assistants = input.required<Assistant[]>();
  deleted = output<void>();
  edit = output<string>();

  openDeleteDialog(assistant: Assistant) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: getFullname(assistant.firstName, assistant.lastName, assistant.middleName),
        subtitle: 'Вы уверены что хотите удалить ассистента?'
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.assistantService.deleteAssistant(assistant.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Ассистент удален', '', { panelClass: 'snackbar-success' });
                this.deleted.emit();
              }
            })
        }
      });
  }

  reactivateAssistant(assistant: Assistant) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: getFullname(assistant.firstName, assistant.lastName, assistant.middleName),
        subtitle: 'Вы уверены что хотите восстановить ассистента?'
      }
    });


    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.assistantService.activateAssistant(assistant.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Ассистент восстановлен', '', {panelClass: 'snackbar-success'});
                this.deleted.emit();
              }
            })
        }
      });
  }
}
