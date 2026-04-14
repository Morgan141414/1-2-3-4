import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, map, switchMap, tap} from 'rxjs';

import {OrganizationProcedureService} from '../../../core/services/organization-procedure.service';
import {RoomService} from '../../../core/services/room.service';
import {Procedure, UpdateOrganizationProcedureRequest} from '../../../core/model/procedure.model';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-org-procedure-settings-panel',
  imports: [
    ReactiveFormsModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './org-procedure-settings-panel.component.html',
  styleUrl: './org-procedure-settings-panel.component.scss',
  standalone: true
})
export class OrgProcedureSettingsPanelComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly orgProcService = inject(OrganizationProcedureService);
  private readonly roomService = inject(RoomService);
  specId = input.required<string>();
  orgProcId = input.required<string>();
  rooms = this.roomService.rooms;

  procedure = signal<Procedure | null>(null);

  form = new FormGroup({
    roomRequired: new FormControl(false, Validators.required),
    roomIds: new FormControl<string[]>([]),
  });

  ngOnInit() {
    this.route.params
      .pipe(
        tap(() => this.form.disable()),
        map(params => params["orgProcId"]),
        switchMap(orgProcId => this.orgProcService.getOrganizationProcedure(orgProcId))
      )
      .subscribe(resp => {
        this.form.controls.roomRequired.setValue(resp.roomRequired);
        this.form.controls.roomIds.setValue(resp.roomIds || [])
        this.procedure.set(resp.procedure);
        this.form.enable();
      });

    this.getRooms();
  }

  ngOnDestroy() {
    this.roomService.clearState();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    this.orgProcService.updateOrganizationProcedure(
      this.orgProcId(),
      this.form.value as UpdateOrganizationProcedureRequest
    )
      .pipe(
        switchMap(() => this.orgProcService.getOrganizationProcedures(this.specId())),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Услуга обновлена', '', { panelClass: 'snackbar-success' });
        }
      })
  }

  private getRooms() {
    this.roomService.getRooms()
      .subscribe();
  }

}
