export enum UserRoleType {
  ROLE_SUPERADMIN = 'ROLE_SUPERADMIN',
  ROLE_CEO = 'ROLE_CEO',
  ROLE_ORGANIZATION_ADMIN = 'ROLE_ORGANIZATION_ADMIN',
  ROLE_DOCTOR = 'ROLE_DOCTOR',
  ROLE_OPERATOR = 'ROLE_OPERATOR',
  ROLE_RECEPTIONIST = 'ROLE_RECEPTIONIST',
  ROLE_ACCOUNTANT = 'ROLE_ACCOUNTANT',
  ROLE_ASSISTANT = 'ROLE_ASSISTANT',
  ROLE_PATIENT = 'ROLE_PATIENT',
}

export interface User {
  id: string,
  username: string,
  role: UserRoleType
}

export interface CreateUserRequest {
  username: string,
  password: string
}

export interface UpdateUserRequest {
  password: string
}
