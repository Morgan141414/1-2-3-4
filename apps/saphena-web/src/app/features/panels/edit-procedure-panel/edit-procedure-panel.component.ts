import {Component, inject, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, map, switchMap, tap} from 'rxjs';

import {ProcedureService} from '../../../core/services/procedure.service';
import {CreateProcedureRequest, ProcedureType} from '../../../core/model/procedure.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';
import {
  ProcedureTypeSelectComponent
} from '../../../shared/components/procedure-type-select/procedure-type-select.component';

@Component({
  selector: 'app-edit-procedure-panel',
  imports: [
    InputFieldComponent,
    ProcedureTypeSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-procedure-panel.component.html',
  styleUrl: './edit-procedure-panel.component.scss',
  standalone: true
})
export class EditProcedurePanelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly procedureService = inject(ProcedureService);
  specId = input.required<string>();
  procedureId = input.required<string>();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    nameKk: new FormControl(''),
    nameEn: new FormControl(''),
    type: new FormControl(ProcedureType.DEFAULT, Validators.required),
    key: new FormControl('')
  });

  ngOnInit() {
    this.route.params
      .pipe(
        tap(() => this.form.disable()),
        map(params => params["procedureId"]),
        switchMap(procedureId => this.procedureService.getProcedure(procedureId))
      )
      .subscribe(resp => {
        this.form.controls.name.setValue(resp.name);
        this.form.controls.nameKk.setValue(resp.nameKk ?? '');
        this.form.controls.nameEn.setValue(resp.nameEn ?? '');
        this.form.controls.type.setValue(resp.type);
        this.form.controls.key.setValue(resp.key || '');
        this.form.enable();
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.procedureService.updateProcedure(
      this.procedureId(),
      this.form.value as CreateProcedureRequest
    )
      .pipe(
        switchMap(() => this.procedureService.getProcedures(this.specId())),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Услуга обновлена', '', { panelClass: 'snackbar-success' });
        }
      })
  }

}
