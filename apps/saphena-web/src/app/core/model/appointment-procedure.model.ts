import {Procedure} from './procedure.model';

export interface AppointmentProcedure {
  id: string,
  procedure: Procedure,
  status: AppointmentProcedureStatusType,
  actualPrice?: number
}

export interface AddAppointmentProcedureRequest {
  procedureId: string,
  actualPrice?: number,
  procedureName?: string,
  isRoomRequired?: boolean
}

export enum AppointmentProcedureStatusType {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}
