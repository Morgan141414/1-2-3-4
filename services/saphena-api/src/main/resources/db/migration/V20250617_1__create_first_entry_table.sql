create table if not exists first_entry

(
    id                          uuid default gen_random_uuid() primary key,
    patient_id                  uuid not null,
    organization_id             uuid not null,
    traffic_source              varchar(50) not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    unique (patient_id, organization_id),
    constraint first_entry_patient_id_fk
        foreign key (patient_id)
            references patient(id),
    constraint first_entry_organization_id_fk
        foreign key (organization_id)
            references organization(id)
);