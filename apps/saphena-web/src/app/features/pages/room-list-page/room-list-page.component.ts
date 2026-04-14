import {Component, inject, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import {RoomService} from '../../../core/services/room.service';
import {RoomTableComponent} from '../../rooms/room-table/room-table.component';

@Component({
  selector: 'app-room-list-page',
  imports: [
    RoomTableComponent
  ],
  templateUrl: './room-list-page.component.html',
  styleUrl: './room-list-page.component.scss',
  standalone: true
})
export class RoomListPageComponent implements OnDestroy {
  private readonly roomService = inject(RoomService);
  private readonly router = inject(Router);

  constructor() {
    this.roomService.getRooms().subscribe();
  }

  ngOnDestroy() {
    this.roomService.clearState();
  }

  openAddRoomPanel() {
    this.router.navigate([{ outlets: { panel: ['panels', 'rooms', 'new'] } }]);
  }
}
