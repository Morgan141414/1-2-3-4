alter table vendor
    add column if not exists organization_id uuid;

alter table vendor
    alter column organization_id
        set not null;

alter table vendor
    drop constraint if exists unique_bin,
    add constraint fk_vendor_organization_id
        foreign key (organization_id)
            references organization(id),
    add constraint unique_org_id_bin
        unique (organization_id, bin);