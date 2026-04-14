alter table procedure
    add column if not exists name_kk varchar(255),
    add column if not exists name_en varchar(255);

alter table specialization_document
    add column if not exists name_kk varchar(255),
    add column if not exists name_en varchar(255);

alter table organization_document
    add column if not exists name_kk varchar(255),
    add column if not exists name_en varchar(255);
