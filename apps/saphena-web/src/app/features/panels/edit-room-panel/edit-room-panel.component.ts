import {Component, inject, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, switchMap} from 'rxjs';

import {RoomService} from '../../../core/services/room.service';
import {UpdateRoomRequest} from '../../../core/model/room.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-edit-room-panel',
  imports: [
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-room-panel.component.html',
  styleUrls: ['./edit-room-panel.component.scss'],
  standalone: true
})
export class EditRoomPanelComponent implements OnInit {
  private readonly roomService = inject(RoomService);
  private readonly matSnackBar = inject(MatSnackBar);
  id = input.required<string>();

  form = new FormGroup({
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.form.disable();
    this.roomService.getRoom(this.id())
      .subscribe(resp => {
        this.form.controls.code.setValue(resp.code);
        this.form.controls.name.setValue(resp.name);
        this.form.enable();
      })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    const req: UpdateRoomRequest = { id: this.id(), ...(this.form.value as any) };
    this.roomService.updateRoom(req)
      .pipe(
        switchMap(() => this.roomService.getRooms()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Кабинет обновлён', '', { panelClass: 'snackbar-success' });
        }
      })
  }
}
