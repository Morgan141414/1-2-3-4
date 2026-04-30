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

export type OrganizationApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface OrganizationApplication {
  id: string,
  clinicName: string,
  organizationName: string,
  address: string,
  phone: string,
  email: string,
  bin: string,
  applicantFullName: string,
  applicantIin: string,
  comment?: string,
  status: OrganizationApplicationStatus,
  moderationComment?: string,
  organizationId?: string,
  createdAt?: string,
  moderatedAt?: string,
}

export interface CreateOrganizationApplicationRequest {
  clinicName: string,
  organizationName: string,
  address: string,
  phone: string,
  email: string,
  bin: string,
  applicantFullName: string,
  applicantIin: string,
  comment?: string,
}

export interface ModerateOrganizationApplicationRequest {
  status: OrganizationApplicationStatus,
  moderationComment?: string,
}

export interface OrganizationUser {
  id: string,
  user: User
}
