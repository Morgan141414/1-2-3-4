alter table specialization
    alter column organization_id set not null;

create index if not exists idx_specialization_organization_id
    on specialization(organization_id);

do $$
begin
    if not exists (
        select 1
        from information_schema.table_constraints
        where table_name = 'specialization'
          and constraint_name = 'specialization_org_id_fk'
    ) THEN
        alter table specialization
            add constraint specialization_org_id_fk
                foreign key (organization_id)
                    references organization(id);
    END IF;
end $$;
