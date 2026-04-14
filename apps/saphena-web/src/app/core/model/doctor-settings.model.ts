export interface DoctorSettings {
  id: string,
  doctorId: string,
  doctorClientRatio: number,
  clinicClientRatio: number,
}

export interface DoctorSettingsRequest {
  doctorClientRatio: number,
  clinicClientRatio: number,
}
