create table if not exists organization_application (
    id uuid primary key,
    clinic_name text not null,
    organization_name text not null,
    address text not null,
    phone text not null,
    email text not null,
    bin char(12) not null,
    applicant_full_name text not null,
    applicant_iin char(12) not null,
    comment text,
    status varchar(32) not null default 'PENDING',
    moderation_comment text,
    moderated_at timestamp,
    organization_id uuid
        references organization(id),
    created_at timestamp not null,
    created_by varchar(255) not null,
    updated_at timestamp,
    updated_by varchar(255) not null,
    deleted boolean not null default false
);

create index if not exists idx_organization_application_status
    on organization_application (status);

create index if not exists idx_organization_application_created_at
    on organization_application (created_at desc);
