alter table doctor_specialization
    alter column organization_id set not null;

alter table doctor_procedure
    alter column organization_id set not null;