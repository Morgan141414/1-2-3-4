import {CreateUserRequest, User} from './user.model';

export interface Doctor {
  id: string,
  iin: string,
  firstName: string,
  lastName: string,
  middleName?: string,
  phone?: string,
  email?: string,
  orgUserId?: string,
  user: User
}

export interface CreateDoctorRequest {
  iin: string,
  firstName: string,
  lastname: string,
  middleName?: string,
  phone?: string,
  email?: string,
  user: CreateUserRequest
}

export interface UpdateDoctorRequest {
  firstName: string,
  lastname: string,
  middleName?: string,
  phone?: string,
  email?: string,
}
