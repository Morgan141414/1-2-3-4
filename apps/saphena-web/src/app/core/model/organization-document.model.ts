export interface OrganizationDocument {
  id: string,
  name: string,
  nameKk?: string,
  nameEn?: string,
  deleted: boolean,
}

export interface CreateOrganizationDocumentRequest {
  name: string,
  nameKk?: string,
  nameEn?: string
}
