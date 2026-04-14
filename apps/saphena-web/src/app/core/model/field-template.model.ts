export interface FieldTemplate {
  id: string,
  name: string,
  content: string,
}

export interface CreateFieldTemplateRequest {
  documentId: string,
  fieldKey: string,
  name: string,
  content: string,
}
