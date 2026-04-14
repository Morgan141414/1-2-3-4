alter table doctor_specialization
    add column if not exists organization_id uuid;

alter table doctor_specialization
    add constraint doctor_specialization_organization_id_fk
        foreign key (organization_id)
            references organization(id);

alter table doctor_specialization
    drop constraint if exists doctor_specialization_doctor_id_specialization_id_key;

alter table doctor_specialization
    add constraint doc_spec_doc_id_spec_id_org_id_unique
        unique (doctor_id, specialization_id, organization_id);