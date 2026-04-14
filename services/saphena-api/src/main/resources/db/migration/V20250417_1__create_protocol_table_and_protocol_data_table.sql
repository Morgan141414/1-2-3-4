create table if not exists protocol
(
    id                              uuid default gen_random_uuid() primary key,
    type                            varchar(50) not null,
    organization_id                 uuid not null,
    sections                        jsonb not null,
    template_file_name              varchar(120),
    consultation_required           boolean default false,
    organization_document_id        uuid,
    specialization_document_id      uuid,
    procedure_id                    uuid,

    created_at                      timestamp not null default current_timestamp,
    created_by                      varchar(120) not null,
    updated_at                      timestamp not null default current_timestamp,
    updated_by                      varchar(120) not null,
    deleted                         boolean not null default false,

    constraint protocol_organization_id_fk
        foreign key (organization_id)
            references organization(id),
    constraint protocol_organization_document_id_fk
        foreign key (organization_document_id)
            references organization_document(id),
    constraint protocol_specialization_document_id_fk
        foreign key (specialization_document_id)
            references specialization_document(id),
    constraint protocol_procedure_id_fk
        foreign key (procedure_id)
            references procedure(id)
);


create table if not exists protocol_data(
    id                              uuid default gen_random_uuid() primary key,
    type                            varchar(50) not null,
    protocol_id                     uuid not null,
    patient_id                      uuid not null,
    appointment_id                  uuid,
    doctor_assistant_id             uuid,
    data                            jsonb,

    created_at                      timestamp not null default current_timestamp,
    created_by                      varchar(120) not null,
    updated_at                      timestamp not null default current_timestamp,
    updated_by                      varchar(120) not null,
    deleted                         boolean not null default false,

    constraint protocol_data_protocol_id_fk
        foreign key (protocol_id)
            references protocol(id),
    constraint protocol_data_patient_id_fk
        foreign key (patient_id)
            references patient(id),
    constraint protocol_data_appointment_id_fk
        foreign key (appointment_id)
            references appointment(id),
    constraint protocol_data_doctor_assistant_id_fk
        foreign key (doctor_assistant_id)
            references assistant(id)
);