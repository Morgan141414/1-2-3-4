import {CreateUserRequest} from './user.model';

export interface CreateAssistantRequest {
  user: CreateUserRequest,
  firstName: string,
  lastName: string,
  middleName?: string,
  types: AssistantType[]
}

export interface UpdateAssistantRequest {
  firstName: string,
  lastName: string,
  middleName?: string,
  types: AssistantType[]
}

export interface Assistant {
  id: string,
  types: AssistantType[],
  firstName: string,
  lastName: string,
  middleName?: string,
  deleted: boolean
}

export enum AssistantType {
  DOCTOR_ASSISTANT = 'DOCTOR_ASSISTANT',
  NURSE = 'NURSE',
  NURSE_ASSISTANT = 'NURSE_ASSISTANT',
  OPERATING_NURSE = 'OPERATING_NURSE',
  OPERATING_NURSE_ASSISTANT = 'OPERATING_NURSE_ASSISTANT',
  ANESTHETIST = 'ANESTHETIST',
  SURGEON_ASSISTANT = 'SURGEON_ASSISTANT'
}
