import {Assistant} from './assistant.model';

export interface DoctorAssistant {
  id: string,
  assistant: Assistant
}

export interface AddDoctorAssistantRequest {
  doctorId: string,
  assistantId: string,
  orgUserId: string
}
