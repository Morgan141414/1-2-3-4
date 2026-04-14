create table if not exists audit_event
(
    id              uuid default gen_random_uuid() primary key,
    principal       varchar(100) not null,
    event_type      varchar(64)  not null,
    event_timestamp timestamptz  not null,
    data            jsonb
);

create index if not exists idx_audit_event_principal on audit_event (principal);
create index if not exists idx_audit_event_timestamp on audit_event (event_timestamp);
create index if not exists idx_audit_event_type on audit_event (event_type);
