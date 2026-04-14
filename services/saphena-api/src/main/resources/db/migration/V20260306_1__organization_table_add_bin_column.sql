alter table organization
    add column if not exists bin char(12);

create unique index if not exists ux_organization_bin_not_null
    on organization (bin)
    where bin is not null;