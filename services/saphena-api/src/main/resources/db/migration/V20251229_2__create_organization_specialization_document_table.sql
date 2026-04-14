create table if not exists organization_specialization_document (
    id                          uuid default gen_random_uuid() primary key,
    organization_id             uuid not null,
    specialization_document_id  uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    unique (organization_id, specialization_document_id),
    constraint org_spec_doc_org_id_fk
        foreign key (organization_id)
            references organization(id),
    constraint org_spec_doc_spec_doc_id_fk
        foreign key (specialization_document_id)
            references specialization_document(id)
);
