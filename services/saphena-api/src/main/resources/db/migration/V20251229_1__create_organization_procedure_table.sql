create table if not exists organization_procedure (
    id                          uuid default gen_random_uuid() primary key,
    organization_id             uuid not null,
    procedure_id                uuid not null,
    room_required               boolean not null default false,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    unique (organization_id, procedure_id),
    constraint org_procedure_org_id_fk
        foreign key (organization_id)
            references organization(id),
    constraint org_procedure_procedure_id_fk
        foreign key (procedure_id)
            references procedure(id)
);
