alter table procedure
add column if not exists key varchar(50);

alter table procedure
    add constraint unique_key_specialization_id
        unique(key, specialization_id);