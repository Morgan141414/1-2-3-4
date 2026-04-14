alter table vendor
    add column if not exists contact_person_name varchar(124);

alter table vendor
    rename phone to contact_person_phone;