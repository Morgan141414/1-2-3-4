import {Component, inject, input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, switchMap} from 'rxjs';

import {ProcedureService} from '../../../core/services/procedure.service';
import {PanelService} from '../../../core/services/panel.service';
import {CreateProcedureRequest, ProcedureType} from '../../../core/model/procedure.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {
  ProcedureTypeSelectComponent
} from '../../../shared/components/procedure-type-select/procedure-type-select.component';

@Component({
  selector: 'app-create-procedure-panel',
  imports: [
    FormsModule,
    InputFieldComponent,
    ReactiveFormsModule,
    ProcedureTypeSelectComponent,
  ],
  templateUrl: './create-procedure-panel.component.html',
  styleUrl: './create-procedure-panel.component.scss',
  standalone: true
})
export class CreateProcedurePanelComponent {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly procedureService = inject(ProcedureService);
  private readonly panelService = inject(PanelService);
  specId = input.required<string>();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    nameKk: new FormControl(''),
    nameEn: new FormControl(''),
    type: new FormControl(ProcedureType.DEFAULT, Validators.required),
    key: new FormControl('')
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.procedureService.createProcedure(this.specId(), this.form.value as CreateProcedureRequest)
      .pipe(
        switchMap(() => this.procedureService.getProcedures(this.specId())),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Услуга добавлена', '', { panelClass: 'snackbar-success' });
          this.panelService.closePanel();
          this.form.reset();
        }
      })
  }

}
