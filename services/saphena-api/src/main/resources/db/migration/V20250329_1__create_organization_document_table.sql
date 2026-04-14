create table if not exists organization_document(
    id                          uuid default gen_random_uuid() primary key,
    name                        varchar(255) not null,
    organization_id             uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint organization_document_organization_id_fk
        foreign key (organization_id)
            references organization(id)
);


create table if not exists organization_document_protocol
(
    id                              uuid default gen_random_uuid() primary key,
    sections                        jsonb not null,
    template                        varchar(120),
    organization_document_id        uuid not null,

    created_at                      timestamp not null default current_timestamp,
    created_by                      varchar(120) not null,
    updated_at                      timestamp not null default current_timestamp,
    updated_by                      varchar(120) not null,
    deleted                         boolean not null default false,

    constraint organization_document_protocol_organization_document_id_fk
        foreign key (organization_document_id)
            references organization_document(id)
);


create table if not exists organization_document_protocol_data(
    id                                      uuid default gen_random_uuid() primary key,
    patient_id                              uuid not null,
    organization_document_id                uuid not null,
    organization_document_protocol_id       uuid not null,
    data                                    jsonb,

    created_at                              timestamp not null default current_timestamp,
    created_by                              varchar(120) not null,
    updated_at                              timestamp not null default current_timestamp,
    updated_by                              varchar(120) not null,
    deleted                                 boolean not null default false,

    constraint organization_document_protocol_data_patient_id_fk
        foreign key (patient_id)
            references patient(id),
    constraint organization_document_protocol_data_organization_document_id_fk
        foreign key (organization_document_id)
            references organization_document(id),
    constraint organization_document_protocol_data_org_doc_protocol_id_fk
        foreign key (organization_document_protocol_id)
            references organization_document_protocol(id)
);