create table if not exists room
(
    id              uuid                  default gen_random_uuid() primary key,
    code            varchar(30)  not null,
    name            varchar(120) null,
    organization_id uuid         not null,

    created_at      timestamp    not null default current_timestamp,
    created_by      varchar(120) not null,
    updated_at      timestamp    not null default current_timestamp,
    updated_by      varchar(120) not null,
    deleted         boolean      not null default false,

    unique (name, organization_id),
    constraint room_organization_id_fk
        foreign key (organization_id)
            references organization (id),
    constraint room_org_code_uq
        unique (organization_id, code)
);

create table if not exists room_procedure
(
    id              uuid                  default gen_random_uuid() primary key,
    room_id         uuid         not null,
    procedure_id    uuid         not null,
    organization_id uuid         not null,

    created_at      timestamp    not null default current_timestamp,
    created_by      varchar(120) not null,
    updated_at      timestamp    not null default current_timestamp,
    updated_by      varchar(120) not null,
    deleted         boolean      not null default false,

    unique (room_id, procedure_id, organization_id),
    constraint room_procedure_room_id_fk
        foreign key (room_id)
            references room (id),
    constraint room_procedure_procedure_id_fk
        foreign key (procedure_id)
            references procedure (id),
    constraint room_procedure_organization_id_fk
        foreign key (organization_id)
            references organization (id)
);

create index if not exists room_procedure_org_procedure_idx on room_procedure (organization_id, procedure_id);
create index if not exists room_procedure_org_room_idx on room_procedure (organization_id, room_id);
