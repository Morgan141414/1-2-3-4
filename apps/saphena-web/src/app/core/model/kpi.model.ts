import {AssistantType} from './assistant.model';
import {UserRoleType} from './user.model';
import {Patient} from './patient.model';
import {ClientOwnershipType} from './appointment.model';
import {Page} from './page.model';

export interface DoctorKpiSummary {
  doctorId: string,
  doctorFullname: string,
  totalRevenue: number,
  clinicShare: number,
  doctorShare:number,
}

export interface AssistantKpiSummary {
  assistantId: string,
  assistantFullname: string,
  participations: AssistantParticipation[],
}

export interface AssistantParticipation {
  assistantType?: AssistantType,
  count: number,
}

export interface OperatorKpiSummary {
  operatorId: string,
  operatorUsername: string,
  appointmentsCreated: number,
}

export interface ReceptionKpiSummary {
  receptionistId: string,
  receptionUsername: string,
  clientsServed: number,
}

export interface KpiEvent {
  id?: string,
  organizationId: string,
  userId: string,
  userRole: UserRoleType,
  eventType: KpiEventType,
  clientOwnershipType: ClientOwnershipType,
  appointmentId?: string,
  procedureId?: string,
  protocolDataId?: string,
  amount?: number,
  occurredAt: string,
  assistantType?: AssistantType,
  patient?: Patient,
  procedureName?: string,
}

export interface MyKpi {
  share: number,
  events: Page<KpiEvent>
}

export enum KpiEventType {
  OPERATOR_APPOINTMENT_CREATED = 'OPERATOR_APPOINTMENT_CREATED',
  DOCTOR_SERVICE_PROVIDED = 'DOCTOR_SERVICE_PROVIDED',
  ASSISTANT_PARTICIPATION = 'ASSISTANT_PARTICIPATION',
  RECEPTION_CLIENT_SERVED = 'RECEPTION_CLIENT_SERVED'
}
