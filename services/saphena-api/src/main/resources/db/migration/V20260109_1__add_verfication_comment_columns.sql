alter table patient
add column if not exists verification_comment varchar(500);

alter table patient_document
add column if not exists verification_comment varchar(500);
