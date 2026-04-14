export interface Specialization {
  id: string,
  name: string,
  deleted: boolean,
}

export interface CreateSpecializationRequest {
  name: string
}
