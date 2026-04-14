create table if not exists field_template
(
    id              uuid default gen_random_uuid() primary key,
    user_id         uuid not null,
    procedure_id    uuid not null,
    field_key       varchar(100) not null,
    name            varchar(100),
    content         text not null
);

create index if not exists idx_field_template_user_procedure_field
    on field_template (user_id, procedure_id, field_key);
