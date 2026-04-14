export interface Procedure {
  id: string,
  name: string,
  type: ProcedureType,
  nameKk?: string,
  nameEn?: string,
  key?: string,
  deleted: boolean,
}

export interface CreateProcedureRequest {
  name: string,
  type: ProcedureType,
  nameKk?: string,
  nameEn?: string,
  key?: string,
}

export interface OrganizationProcedure {
  id: string,
  procedure: Procedure,
  roomRequired: boolean,
  roomIds?: string[],
  deleted: boolean,
  modified?: boolean
}

export interface UpdateOrganizationProcedureRequest {
  roomRequired: boolean,
  roomIds: string[],
}

export enum ProcedureType {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
  DEFAULT = 'DEFAULT'
}
