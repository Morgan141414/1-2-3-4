create table if not exists organization_logo (
     organization_id uuid primary key
         references organization(id)
             on delete cascade,
     file_data bytea not null,
     content_type text not null,
     file_name text
);
