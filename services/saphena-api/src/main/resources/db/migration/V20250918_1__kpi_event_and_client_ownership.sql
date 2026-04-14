alter table appointment
    add column if not exists client_ownership varchar(20) default 'CLINIC';

create index if not exists idx_appointment_client_ownership on appointment (client_ownership);

-- KPI event table
create table if not exists kpi_event
(
    id                    uuid                  default gen_random_uuid() primary key,
    organization_id       uuid         not null,
    user_id               uuid         not null,
    user_role             varchar(50),
    event_type            varchar(50)  not null,
    client_ownership_type varchar(50)  not null,
    appointment_id        uuid,
    procedure_id          uuid,
    protocol_data_id      uuid,
    amount                numeric(12, 2),
    occurred_at           timestamp    not null default current_timestamp,

    created_at            timestamp    not null default current_timestamp,
    created_by            varchar(120) not null default 'system',
    updated_at            timestamp    not null default current_timestamp,
    updated_by            varchar(120) not null default 'system',
    deleted               boolean      not null default false
);

create index if not exists idx_kpi_event_org_time on kpi_event (organization_id, occurred_at);
create index if not exists idx_kpi_event_user on kpi_event (user_id);
create index if not exists idx_kpi_event_type on kpi_event (event_type);
