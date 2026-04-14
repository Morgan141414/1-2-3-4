import {Patient} from './patient.model';
import {AddAppointmentProcedureRequest, AppointmentProcedure} from './appointment-procedure.model';
import {TrafficSourceType} from './analytics.model';
import {Doctor} from './doctor.model';

export interface Appointment {
  id: string,
  doctor: Doctor,
  specializationId: string,
  datetime: string,
  endDatetime: string,
  status: AppointmentStatusType,
  patient: Patient,
  procedures: AppointmentProcedure[],
  comment?: string,
  room?: string,
  tempPatientName?: string,
  tempPatientPhone?: string,
  paymentType: PaymentType,
  paymentStatus: PaymentStatusType,
}

export interface CreateAppointmentRequest {
  orgUserId: string,
  patientId?: string,
  specializationId: string,
  doctorId: string,
  procedures: AddAppointmentProcedureRequest[],
  datetime: string,
  endDatetime: string,
  trafficSource: TrafficSourceType | null,
  roomId?: string,
  clientOwnershipType: ClientOwnershipType,
  tempPatientName?: string,
  tempPatientPhone?: string,
  paymentType: PaymentType,
  paymentStatus: PaymentStatusType,
}

export interface UpdatePaymentStatusRequest {
  paymentType: PaymentType,
  paymentStatus: PaymentStatusType,
}

export enum AppointmentStatusType {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum ClientOwnershipType {
  DOCTOR = 'DOCTOR',
  CLINIC = 'CLINIC'
}

export enum PaymentType {
  NOT_DEFINED = 'NOT_DEFINED',
  CASH = 'CASH',
  CARD = 'CARD',
  QR = 'QR',
  INSTALLMENT = 'INSTALLMENT',
}

export enum PaymentStatusType {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}
