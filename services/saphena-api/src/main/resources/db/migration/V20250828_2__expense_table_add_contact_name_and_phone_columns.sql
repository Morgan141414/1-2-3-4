alter table expense
    add column if not exists contact_person_name varchar(124),
    add column if not exists contact_person_phone varchar(15);