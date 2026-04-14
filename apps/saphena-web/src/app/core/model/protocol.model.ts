import {AssistantType} from './assistant.model';
import {GenderType} from './patient.model';

export interface Protocol {
  id: string,
  sections: ProtocolSection[],
  consultationRequired?: boolean,
  templateFileName?: string,
  modified: boolean,
}

export interface ProtocolSection {
  title: string,
  titleKk?: string,
  titleEn?: string,
  fields: ProtocolField[]
}

export interface ProtocolField {
  key: string,
  title: string,
  titleKk?: string,
  titleEn?: string,
  required?: boolean,
  gender?: GenderType,
  type: ProtocolFieldType,
  unit: string,
  options: string[],
  assistantType?: AssistantType,
  doctorSpecializationId?: string,
  tableColumns?: ProtocolTableColumn[],
  tableRows?: ProtocolTableRow[],
}

export interface CreateProtocolRequest {
  sections: ProtocolSection[],
  consultationRequired?: boolean,
  templateFileName?: string
}

export interface ProtocolTableColumn {
  key: string,
  title: string,
  titleKk?: string,
  titleEn?: string,
  unit?: string,
}

export interface ProtocolTableRow {
  key: string,
  title: string,
  titleKk?: string,
  titleEn?: string,
}

export interface ProtocolConstructorDialogData {
  targetType: ProtocolTargetType,
  targetId: string,
  targetName: string,
}

export enum ProtocolFieldType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  NUMBER = 'NUMBER',
  RADIO = 'RADIO',
  SELECT = 'SELECT',
  DATE = 'DATE',
  SUBTITLE = 'SUBTITLE',
  RANGE = 'RANGE',
  DIAGNOSIS_MKB = 'DIAGNOSIS_MKB',
  PROCEDURE_LIST = 'PROCEDURE_LIST',
  ASSISTANT_SELECT = 'ASSISTANT_SELECT',
  DOCTOR_SELECT = 'DOCTOR_SELECT',
  CHECKBOX = 'CHECKBOX',
  TABLE = 'TABLE',
}

export enum ProtocolTargetType {
  PROCEDURE = 'PROCEDURE',
  SPEC_DOC = 'SPEC_DOC',
  ORG_DOC = 'ORG_DOC'
}
