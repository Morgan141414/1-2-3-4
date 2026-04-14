import {User} from './user.model';

export interface Organization {
  id: string,
  clinicName: string,
  organizationName: string,
  address: string,
  phone: string,
  email: string,
  bin?: string,
}

export interface CreateOrganizationRequest {
  clinicName: string,
  organizationName: string,
  address: string,
  phone: string,
  email: string,
  bin: string,
}

export interface OrganizationUser {
  id: string,
  user: User
}
