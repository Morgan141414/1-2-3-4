export interface SpecializationDocument {
  id: string,
  name: string,
  nameKk?: string,
  nameEn?: string,
  deleted: boolean,
}

export interface CreateSpecializationDocumentRequest {
  name: string,
  nameKk?: string,
  nameEn?: string
}

export interface OrganizationSpecDoc {
  id: string,
  specDoc: SpecializationDocument,
  deleted: boolean,
  modified?: boolean,
}
