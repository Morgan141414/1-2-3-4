alter table doctor_procedure
    add column if not exists organization_id uuid;

alter table doctor_procedure
    add constraint doctor_procedure_organization_id_fk
        foreign key (organization_id)
            references organization(id);