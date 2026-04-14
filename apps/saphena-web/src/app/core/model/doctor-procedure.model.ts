import {OrganizationProcedure} from './procedure.model';

export interface DoctorProcedure {
  id: string,
  orgProcedure: OrganizationProcedure,
  price?: number
}

export interface AddDoctorProcedureRequest {
  docSpecId: string,
  orgProcedureId: string,
  price?: number
}
