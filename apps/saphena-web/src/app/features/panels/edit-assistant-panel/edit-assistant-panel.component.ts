import {Component, inject, input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, map, switchMap, tap} from 'rxjs';

import {AssistantService} from '../../../core/services/assistant.service';
import {PanelService} from '../../../core/services/panel.service';
import {AssistantType, UpdateAssistantRequest} from '../../../core/model/assistant.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {getAssistantTypeName} from '../../../shared/utils/name.util';

@Component({
  selector: 'app-edit-assistant-panel',
  imports: [
    FormsModule,
    InputFieldComponent,
    ReactiveFormsModule,
    MatOption,
    MatSelect
  ],
  templateUrl: './edit-assistant-panel.component.html',
  styleUrl: './edit-assistant-panel.component.scss',
  standalone: true
})
export class EditAssistantPanelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly assistantService = inject(AssistantService);
  private readonly panelService = inject(PanelService);
  protected readonly getAssistantTypeName = getAssistantTypeName;
  id = input.required<string>();

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    middleName: new FormControl(''),
    types: new FormControl<AssistantType[]>([], Validators.required)
  });
  assistantTypes = Object.values(AssistantType);

  ngOnInit() {
    this.route.params
      .pipe(
        tap(() => this.form.disable()),
        map(params => params["id"]),
        switchMap(id => this.assistantService.getAssistant(id))
      )
      .subscribe(assistant => {
        this.form.controls.firstName.setValue(assistant.firstName);
        this.form.controls.lastName.setValue(assistant.lastName);
        this.form.controls.middleName.setValue(assistant.middleName || '');
        this.form.controls.types.setValue(assistant.types)
        this.form.enable();
      })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.assistantService.updateAssistant(this.id(), this.form.value as UpdateAssistantRequest)
      .pipe(
        switchMap(() => this.assistantService.getAssistants()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Ассистент обновлен', '', { panelClass: 'snackbar-success' });
          this.panelService.closePanel();
        }
      })
  }
}
