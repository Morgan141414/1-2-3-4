create table if not exists vendor(
    id                          uuid default gen_random_uuid() primary key,
    bin                         varchar(50) not null unique,
    name                        varchar(100),

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint unique_bin unique (bin)
);

create table if not exists expense_type(
    id                          uuid default gen_random_uuid() primary key,
    organization_id             uuid not null,
    name                        varchar(100) not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint fk_expense_type_organization_id
        foreign key (organization_id)
            references organization(id),
    constraint unique_organization_id_name
        unique (organization_id, name)
);

create table if not exists expense(
    id                          uuid default gen_random_uuid() primary key,
    organization_id             uuid not null,
    type_id                     uuid not null,
    vendor_id                   uuid,
    date                        timestamp not null,
    cost                        numeric(12, 2) not null,
    comment                     varchar(500),

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint fk_expense_organization_id
        foreign key (organization_id)
            references organization(id),
    constraint fk_expense_type_id
        foreign key (type_id)
            references expense_type(id),
    constraint fk_expense_vendor_id
        foreign key (vendor_id)
            references vendor(id)
);
