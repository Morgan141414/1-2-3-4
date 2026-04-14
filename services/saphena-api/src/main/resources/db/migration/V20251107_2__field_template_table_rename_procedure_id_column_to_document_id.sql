alter table field_template
    rename column procedure_id to document_id;

alter index if exists idx_field_template_user_procedure_field
    rename to idx_field_template_user_id_document_id_field_key;
