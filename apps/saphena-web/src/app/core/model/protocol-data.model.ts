import {ProtocolFieldType, ProtocolTableColumn, ProtocolTableRow} from './protocol.model';
import {AssistantType} from './assistant.model';
import {Mkb10} from './mkb10.model';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

export interface ProtocolData {
  id: string,
  data: ProtocolSectionData[],
  doctorAssistantId?: string,
  createdAt: string
}

export interface CreateProtocolDataRequest {
  protocolId: string,
  patientId: string,
  data: ProtocolSectionData[],
  doctorAssistantId?: string,
  appointmentId?: string,
}

export interface UpdateProtocolDataRequest {
  data: ProtocolSectionData[],
  doctorAssistantId?: string
}

export interface ProtocolSectionData {
  title: string,
  titleKk?: string,
  titleEn?: string,
  fields: ProtocolFieldData[]
}

export interface ProtocolFieldData {
  key: string,
  type: ProtocolFieldType,
  title: string,
  titleKk?: string,
  titleEn?: string,
  value: string,
  from?: number,
  to?: number,
  diagnosis?: Mkb10[],
  assistantType?: AssistantType,
  assistantIds?: string[],
  doctorSpecializationId?: string,
  doctorIds?: string[]
  providedProcedures?: ProvidedProcedure[],
  unit?: string,
  tableColumns?: ProtocolTableColumn[],
  tableRows?: ProtocolTableRow[],
  tableData?: Record<string, string>
}

export interface ProvidedProcedure {
  name: string,
  cost: number,
  number: number,
  totalCost: number
}

export interface ProtocolDataForm {
  data: FormArray<FormGroup<ProtocolDataFormSection>>,
  doctorAssistantId?: FormControl
}

export interface ProtocolDataFormSection {
  title: FormControl,
  titleKk: FormControl,
  titleEn: FormControl,
  fields: FormArray<FormGroup<ProtocolDataFormSectionField>>
}

export interface ProtocolDataFormSectionField {
  key: FormControl,
  type: FormControl,
  title: FormControl,
  titleKk: FormControl,
  titleEn: FormControl,
  value: FormControl,
  from: FormControl,
  to: FormControl,
  diagnosis: FormControl,
  assistantType: FormControl,
  assistantIds: FormControl,
  doctorSpecializationId: FormControl,
  doctorIds: FormControl
  providedProcedures: FormControl,
  unit: FormControl,
  tableColumns: FormControl,
  tableRows: FormControl,
  tableData: FormControl
}
