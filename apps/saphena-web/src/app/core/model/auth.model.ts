import { UserRoleType } from "./user.model"

export interface SignInRequest {
  username: string,
  password: string
}

export interface SignInResponse {
  token: string,
  username: string,
  role: UserRoleType,
  organizationIds: string[]
}

export interface ChangePasswordRequest {
  oldPassword: string,
  newPassword: string,
}

export interface CompleteRegistrationRequest {
  iin: string,
  code: string,
  password: string,
}
