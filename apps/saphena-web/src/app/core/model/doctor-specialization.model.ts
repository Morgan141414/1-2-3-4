import {Specialization} from './specialization.model';
import {Doctor} from './doctor.model';

export interface DoctorSpecialization {
  id: string,
  specialization: Specialization,
  doctor?: Doctor,
}

export interface AddDoctorSpecializationRequest {
  specializationId: string,
  orgUserId: string
}
