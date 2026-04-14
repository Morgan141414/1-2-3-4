alter table specialization
    drop column if exists organization_id;

alter table specialization
    add unique (name);