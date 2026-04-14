export interface Room {
  id: string;
  code: string;
  name: string;
}

export interface CreateRoomRequest {
  code: string;
  name: string;
}

export interface UpdateRoomRequest {
  id: string;
  code: string;
  name: string;
}
