alter table patient
add column if not exists document_type varchar(25);

update patient
set document_type = 'ID_CARD';

alter table patient
drop column if exists passport_number;