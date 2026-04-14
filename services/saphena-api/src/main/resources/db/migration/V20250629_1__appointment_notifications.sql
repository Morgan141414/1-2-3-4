create table if not exists notification
(
    id                          uuid default gen_random_uuid() primary key,
    appointment_id              uuid not null,
    phone                       varchar(15) not null,
    message                     varchar(500) not null,
    scheduled_at                timestamp not null,
    notify_type                 varchar(20) not null,
    status                      varchar(20) not null default 'SCHEDULED',

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint notification_appointment_id_fk
        foreign key (appointment_id)
            references appointment(id)
    );
