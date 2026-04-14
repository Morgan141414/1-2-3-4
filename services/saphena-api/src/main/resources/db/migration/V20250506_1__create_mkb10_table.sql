create table if not exists mkb10
(
    id                          uuid default gen_random_uuid() primary key,
    key                         varchar(50) not null unique,
    name                        varchar(100) not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false
);