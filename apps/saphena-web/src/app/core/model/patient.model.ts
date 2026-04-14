import {Kato} from './kato.model';

export interface Patient {
  id: string,
  isCitizen: boolean,
  iin?: string,
  documentType?: PatientDocumentType,
  documentId?: string,
  documentNumber?: string,
  issuedAt?: string,
  expiresAt?: string,
  verificationStatus: PatientDocumentVerificationStatus,
  firstName: string,
  lastName: string,
  middleName?: string,
  gender: GenderType,
  birthdate: string,
  city?: Kato,
  address?: string,
  phone?: string,
  phoneVerified: boolean,
  emergencyContact?: string,
  email?: string,
}

export interface CreatePatientRequest {
  isCitizen: Boolean,
  iin?: string,
  documentType?: PatientDocumentType,
  documentNumber?: string,
  issuedAt?: string,
  expiresAt?: string,
  firstName: string,
  lastName: string,
  middleName?: string,
  gender: GenderType,
  birthdate: string,
  city?: Kato,
  address?: string,
  phone?: string,
  emergencyContact?: string,
  email?: string,
}

export interface UpdatePatientRequest {
  firstName: string,
  lastName: string,
  middleName?: string,
  gender: GenderType,
  birthdate: string,
  city?: Kato,
  address?: string,
  phone?: string,
  emergencyContact?: string,
  email?: string
}

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum PatientDocumentType {
  ID_CARD = 'ID_CARD',
  PASSPORT = 'PASSPORT',
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  // RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
}

export enum PatientDocumentVerificationStatus {
  NOT_PROVIDED = 'NOT_PROVIDED',
  PROVIDED = 'PROVIDED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}
