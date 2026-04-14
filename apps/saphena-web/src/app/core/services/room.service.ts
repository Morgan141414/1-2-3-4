import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs';

import {
  CreateRoomRequest,
  Room,
  UpdateRoomRequest
} from '../model/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly http = inject(HttpClient);

  #rooms = signal<Room[]>([]);
  rooms = this.#rooms.asReadonly();

  getRooms() {
    return this.http.get<Room[]>('/api/rooms')
      .pipe(
        tap(resp => this.#rooms.set(resp))
      );
  }

  getRoom(id: string) {
    return this.http.get<Room>(`/api/rooms/${id}`);
  }

  createRoom(req: CreateRoomRequest) {
    return this.http.post<void>(`/api/rooms`, req);
  }

  updateRoom(req: UpdateRoomRequest) {
    return this.http.put<void>(`/api/rooms`, req);
  }

  deleteRoom(id: string) {
    return this.http.delete<void>(`/api/rooms/${id}`);
  }

  getRoomsByProcedures(ids: string[], start: string, end: string) {
    let params = new HttpParams()
      .set('start', start)
      .set('end', end);

    ids.forEach(id => {
      params = params.append('procedureIds', id);
    });

    return this.http.get<Room[]>(`/api/room-procedures/available`, { params });
  }

  clearState() {
    this.#rooms.set([]);
  }
}
