create table if not exists app_user
(
    id                          uuid default gen_random_uuid() primary key,
    username                    varchar(120) not null unique,
    password                    varchar(120) not null,
    role                        varchar(50) not null,
    enabled                     boolean not null default true,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false
);


create table if not exists organization
(
    id                          uuid default gen_random_uuid() primary key,
    clinic_name                 varchar(120) not null unique,
    organization_name           varchar(120) not null,
    address                     varchar(512),
    phone                       varchar(15),
    email                       varchar(255),

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false
);


create table if not exists user_organization
(
    id                          uuid default gen_random_uuid() primary key,
    user_id                     uuid not null,
    organization_id             uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    unique (user_id, organization_id),
    constraint user_organization_user_id_fk
        foreign key (user_id)
            references app_user(id),
    constraint user_organization_organization_id_fk
        foreign key (organization_id)
            references organization(id)
);


create table if not exists assistant
(
    id                          uuid default gen_random_uuid() primary key,
    first_name                  varchar(50) not null,
    last_name                   varchar(50) not null,
    middle_name                 varchar(50),
    type                        varchar(50) not null,
    organization_id             uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint assistant_organization_id_fk
        foreign key (organization_id)
            references organization(id)
);


create table if not exists organization_employee
(
    id                          uuid default gen_random_uuid() primary key,
    first_name                  varchar(50) not null,
    last_name                   varchar(50) not null,
    middle_name                 varchar(50),
    type                        varchar(50) not null,
    organization_id             uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint assistant_organization_id_fk
        foreign key (organization_id)
            references organization(id)
);


create table if not exists specialization
(
    id                          uuid default gen_random_uuid() primary key,
    name                        varchar(100) not null unique,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false
);


create table if not exists procedure
(
    id                          uuid default gen_random_uuid() primary key,
    name                        varchar(255) not null,
    type                        varchar(25) not null default 'DEFAULT',
    specialization_id           uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    unique(name, specialization_id),
    constraint procedure_specialization_id_fk
        foreign key (specialization_id)
            references specialization(id)
);


create table if not exists specialization_document(
    id                          uuid default gen_random_uuid() primary key,
    name                        varchar(255) not null,
    specialization_id           uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint specialization_document_specialization_id_fk
        foreign key (specialization_id)
            references specialization(id)
);


create table if not exists doctor
(
    id                          uuid default gen_random_uuid() primary key,
    first_name                  varchar(50) not null,
    last_name                   varchar(50) not null,
    middle_name                 varchar(50),
    phone                       varchar(15),
    email                       varchar(254),
    user_id                     uuid not null,
    organization_id             uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint doctor_user_id_fk
        foreign key (user_id)
            references app_user(id),
    constraint doctor_organization_id_fk
        foreign key (organization_id)
            references organization(id)
);


create table if not exists doctor_assistant
(
    id                          uuid default gen_random_uuid() primary key,
    doctor_id                   uuid not null,
    assistant_id                uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    unique (doctor_id, assistant_id),
    constraint doctor_assistant_doctor_id_fk
        foreign key (doctor_id)
            references doctor(id),
    constraint doctor_assistant_assistant_id_fk
        foreign key (assistant_id)
            references assistant(id)
);


create table if not exists doctor_specialization
(
    id                          uuid default gen_random_uuid() primary key,
    doctor_id                   uuid not null,
    specialization_id           uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    unique(doctor_id, specialization_id),
    constraint doctor_specialization_doctor_id_fk
        foreign key (doctor_id)
            references doctor(id),
    constraint doctor_specialization_specialization_id_fk
        foreign key (specialization_id)
            references specialization(id)
);


create table if not exists doctor_procedure
(
    id                          uuid default gen_random_uuid() primary key,
    doctor_id                   uuid not null,
    specialization_id           uuid not null,
    procedure_id                uuid not null,
    price                       int,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    unique(doctor_id, specialization_id, procedure_id),
    constraint doctor_procedure_doctor_id_fk
        foreign key (doctor_id)
            references doctor(id),
    constraint doctor_procedure_specialization_id_fk
        foreign key (specialization_id)
            references specialization(id),
    constraint doctor_procedure_procedure_id_fk
        foreign key (procedure_id)
            references procedure(id)

);


create table if not exists patient
(
    id                          uuid default gen_random_uuid() primary key,
    is_citizen                  boolean not null default true,
    iin                         char(12) unique,
    passport_number             varchar(25) unique,
    first_name                  varchar(50) not null,
    last_name                   varchar(50) not null,
    middle_name                 varchar(50),
    gender                      varchar(10) not null,
    birthdate                   date not null,
    address                     varchar(255),
    phone                       varchar(15),
    emergency_contact           varchar(15),
    email                       varchar(255),

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false
);


create table if not exists appointment(
    id                          uuid default gen_random_uuid() primary key,
    organization_id             uuid not null,
    doctor_id                   uuid not null,
    specialization_id           uuid not null,
    patient_id                  uuid not null,
    status                      varchar(50) not null default 'SCHEDULED',
    datetime                    timestamp not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint appointment_organization_id_fk
        foreign key (organization_id)
            references organization(id),
    constraint appointment_doctor_id_fk
        foreign key (doctor_id)
            references doctor(id),
    constraint appointment_specialization_id_fk
        foreign key (specialization_id)
            references specialization(id),
    constraint appointment_patient_id_fk
        foreign key (patient_id)
            references patient(id)
);


create table if not exists appointment_procedure(
    id                          uuid default gen_random_uuid() primary key,
    appointment_id              uuid not null,
    procedure_id                uuid not null,
    status                      varchar(50) not null default 'IN_PROGRESS',

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    unique (appointment_id, procedure_id),
    constraint appointment_procedure_appointment_id_fk
        foreign key (appointment_id)
            references appointment(id),
    constraint appointment_procedure_id_fk
        foreign key (procedure_id)
            references procedure(id)
);


create table if not exists consultation_protocol
(
    id                          uuid default gen_random_uuid() primary key,
    sections                    jsonb not null,
    template                    varchar(120),
    specialization_id           uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint consultation_protocol_specialization_id_fk
        foreign key (specialization_id)
            references specialization(id)
);


create table if not exists procedure_protocol
(
    id                          uuid default gen_random_uuid() primary key,
    sections                    jsonb not null,
    template                    varchar(120),
    procedure_id                uuid not null,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint protocol_procedure_id_fk
        foreign key (procedure_id)
            references procedure(id)
);


create table if not exists specialization_document_protocol
(
    id                              uuid default gen_random_uuid() primary key,
    sections                        jsonb not null,
    template                        varchar(120),
    assistant_fields                varchar(50)[],
    consultation_required           boolean not null default false,
    specialization_document_id      uuid not null,

    created_at                      timestamp not null default current_timestamp,
    created_by                      varchar(120) not null,
    updated_at                      timestamp not null default current_timestamp,
    updated_by                      varchar(120) not null,
    deleted                         boolean not null default false,

    constraint specialization_document_protocol_specialization_document_id_fk
        foreign key (specialization_document_id)
            references specialization_document(id)
);

create table if not exists consultation_protocol_data(
    id                          uuid default gen_random_uuid() primary key,
    appointment_id              uuid not null unique,
    consultation_protocol_id    uuid not null,
    assistant_id                uuid,
    data                        jsonb,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    constraint consultation_protocol_data_appointment_id_fk
        foreign key (appointment_id)
            references appointment(id),
    constraint consultation_protocol_data_consultation_protocol_fk
        foreign key (consultation_protocol_id)
            references consultation_protocol(id),
    constraint consultation_protocol_data_assistant_id_fk
        foreign key (assistant_id)
            references assistant(id)
);

create table if not exists procedure_protocol_data(
    id                          uuid default gen_random_uuid() primary key,
    appointment_id              uuid not null,
    procedure_id                uuid not null,
    procedure_protocol_id       uuid not null,
    assistant_id                uuid,
    data                        jsonb,

    created_at                  timestamp not null default current_timestamp,
    created_by                  varchar(120) not null,
    updated_at                  timestamp not null default current_timestamp,
    updated_by                  varchar(120) not null,
    deleted                     boolean not null default false,

    unique (appointment_id, procedure_id),
    constraint procedure_protocol_data_appointment_id_fk
     foreign key (appointment_id)
         references appointment(id),
    constraint procedure_protocol_data_procedure_id_fk
        foreign key (procedure_id)
            references procedure(id),
    constraint procedure_protocol_data_procedure_protocol_id_fk
     foreign key (procedure_protocol_id)
         references procedure_protocol(id),
    constraint procedure_protocol_data_assistant_id_fk
     foreign key (assistant_id)
         references assistant(id)
);


create table if not exists specialization_document_protocol_data(
    id                                      uuid default gen_random_uuid() primary key,
    appointment_id                          uuid not null,
    specialization_document_id              uuid not null,
    specialization_document_protocol_id     uuid not null,
    assistant_id                            uuid,
    additional_med_staff                    jsonb,
    data                                    jsonb,

    created_at                              timestamp not null default current_timestamp,
    created_by                              varchar(120) not null,
    updated_at                              timestamp not null default current_timestamp,
    updated_by                              varchar(120) not null,
    deleted                                 boolean not null default false,

    unique (appointment_id, specialization_document_id),
    constraint specialization_document_protocol_data_appointment_id_fk
        foreign key (appointment_id)
            references appointment(id),
    constraint spec_doc_protocol_data_specialization_document_id_fk
        foreign key (specialization_document_id)
            references specialization_document(id),
    constraint spec_doc_protocol_data_spec_doc_protocol_id_fk
        foreign key (specialization_document_protocol_id)
            references specialization_document_protocol(id),
    constraint specialization_document_protocol_data_assistant_id_fk
        foreign key (assistant_id)
            references assistant(id)
);
