import {Component, inject, input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize, switchMap} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

import {AssistantService} from '../../../core/services/assistant.service';
import {AssistantType, CreateAssistantRequest} from '../../../core/model/assistant.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {getAssistantTypeName} from '../../../shared/utils/name.util';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-create-assistant-panel',
  imports: [
    FormsModule,
    InputFieldComponent,
    ReactiveFormsModule,
    MatOption,
    MatSelect
  ],
  templateUrl: './create-assistant-panel.component.html',
  styleUrl: './create-assistant-panel.component.scss',
  standalone: true
})
export class CreateAssistantPanelComponent {
  private readonly assistantService = inject(AssistantService);
  private readonly matSnackBar = inject(MatSnackBar);
  id = input<string>();

  protected readonly assistantType = AssistantType;
  protected readonly getAssistantTypeName = getAssistantTypeName;

  form = new FormGroup({
    types: new FormControl([AssistantType.DOCTOR_ASSISTANT], Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    middleName: new FormControl('')
  });
  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  assistantTypes = Object.values(AssistantType);

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.assistantService.createAssistant({
      user: this.userForm.value,
      ...this.form.value
    } as CreateAssistantRequest)
      .pipe(
        switchMap(() => this.assistantService.getAssistants()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Ассистент добавлен', '', { panelClass: 'snackbar-success' });
          this.form.reset();
          this.userForm.reset();
        }
      })
  }
}
