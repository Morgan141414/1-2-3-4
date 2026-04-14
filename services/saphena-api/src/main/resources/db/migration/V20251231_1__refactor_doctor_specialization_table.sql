alter table doctor_specialization
drop column if exists doctor_id,
drop column if exists organization_id;

alter table doctor_specialization
    add constraint fk_doc_spec_org_user_id
        foreign key (org_user_id)
            references organization_user(id);

alter table doctor_specialization
    add constraint ux_doc_spec_spec_id_org_user_id
        unique (specialization_id, org_user_id);
