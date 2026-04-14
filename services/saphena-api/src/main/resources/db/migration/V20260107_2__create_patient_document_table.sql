create table patient_document (
    id                          uuid default gen_random_uuid() primary key,
    patient_id                  uuid not null,
    type                        varchar(50) not null,
    document_number             varchar(100) not null,
    issued_at                   date,
    expires_at                  date,
    is_active                   boolean not null default true,
    is_verified                 boolean not null default false,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint patient_document_patient_id_fk
        foreign key (patient_id)
            references patient(id)
);

create unique index ux_patient_document_active
    on patient_document (patient_id, type)
    where is_active = true and deleted = false;
