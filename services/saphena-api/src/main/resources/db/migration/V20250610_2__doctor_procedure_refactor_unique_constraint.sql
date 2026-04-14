alter table doctor_procedure
    drop constraint if exists doctor_procedure_doctor_id_specialization_id_procedure_id_key;

alter table doctor_procedure
    add constraint doc_proc_doc_id_spec_id_proc_id_org_id_unique
        unique (doctor_id, specialization_id, procedure_id, organization_id);