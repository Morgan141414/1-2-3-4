alter table doctor_procedure
drop column if exists doctor_id,
drop column if exists specialization_id,
drop column if exists procedure_id,
drop column if exists organization_id;

alter table doctor_procedure
add column if not exists org_procedure_id uuid;

truncate table doctor_procedure;

alter table doctor_procedure
    alter column org_procedure_id set not null;

alter table doctor_procedure
    add constraint fk_doc_procedure_doc_spec_id
        foreign key (doc_spec_id)
            references doctor_specialization(id);

alter table doctor_procedure
    add constraint fk_doc_procedure_org_procedure_id
        foreign key (org_procedure_id)
            references organization_procedure(id);

alter table doctor_procedure
    add constraint ux_doc_proc_doc_spec_id_org_procedure_id
        unique (doc_spec_id, org_procedure_id);
