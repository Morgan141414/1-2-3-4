create table if not exists doctor_settings
(
    id                  uuid          not null primary key,
    doctor_id           uuid          not null unique,
    doctor_client_ratio numeric(5, 2) not null,
    clinic_client_ratio numeric(5, 2) not null,
    created_by          varchar(255),
    created_at          timestamp     not null default current_timestamp,
    updated_by          varchar(255),
    updated_at          timestamp     not null default current_timestamp,
    deleted             boolean       not null default false,

    constraint fk_doctor_settings_doctor_id
        foreign key (doctor_id)
            references organization_user (id)
);
