alter table protocol
    add column if not exists document_id uuid;

update protocol
set document_id = coalesce(organization_document_id, specialization_document_id, procedure_id);

alter table protocol
    alter column document_id set not null;

create index if not exists idx_protocol_document_id
    on protocol(document_id);
