import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize, switchMap} from 'rxjs';

import {RoomService} from '../../../core/services/room.service';
import {CreateRoomRequest} from '../../../core/model/room.model';
import {InputFieldComponent} from '../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-create-room-panel',
  imports: [
    InputFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './create-room-panel.component.html',
  styleUrls: ['./create-room-panel.component.scss'],
  standalone: true
})
export class CreateRoomPanelComponent {
  private readonly roomService = inject(RoomService);
  private readonly matSnackBar = inject(MatSnackBar);

  form = new FormGroup({
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.roomService.createRoom(this.form.value as CreateRoomRequest)
      .pipe(
        switchMap(() => this.roomService.getRooms()),
        finalize(() => this.form.enable())
      )
      .subscribe({
        next: _ => {
          this.matSnackBar.open('Кабинет добавлен', '', { panelClass: 'snackbar-success' });
          this.form.reset();
        }
      })
  }
}
