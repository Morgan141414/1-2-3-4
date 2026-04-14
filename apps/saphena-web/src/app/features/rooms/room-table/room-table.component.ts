import {Component, inject, output} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

import {RoomService} from '../../../core/services/room.service';
import {Room} from '../../../core/model/room.model';
import {ConfirmationDialogComponent} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-room-table',
  imports: [
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './room-table.component.html',
  styleUrl: './room-table.component.scss',
  standalone: true
})
export class RoomTableComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly roomService = inject(RoomService);

  rooms = this.roomService.rooms;
  deleted = output<void>();
  edit = output<string>();

  openEditRoomPanel(id: string) {
    this.router.navigate([{ outlets: { panel: ['panels', 'rooms', id, 'edit'] } }]);
  }

  openDeleteDialog(room: Room) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: room.name, subtitle: 'Вы уверены что хотите удалить кабинет?' }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.roomService.deleteRoom(room.id)
            .subscribe({
              next: _ => {
                this.matSnackBar.open('Кабинет удалён', '', { panelClass: 'snackbar-success' });
                this.roomService.getRooms().subscribe();
              }
            })
        }
      })
  }
}
