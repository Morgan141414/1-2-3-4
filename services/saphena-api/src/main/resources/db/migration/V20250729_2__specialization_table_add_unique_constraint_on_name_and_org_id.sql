alter table specialization
    drop constraint if exists specialization_name_key;

alter table specialization
    add constraint unique_name_organization_id
        unique(name, organization_id);