alter table patient
add column if not exists iin_verification_status varchar(50) not null default 'NOT_PROVIDED';

update patient
set iin_verification_status = 'PROVIDED'
    where iin is not null;

alter table patient
    drop column if exists iin_verified;

alter table patient_document
add column if not exists verification_status varchar(50) not null default 'PROVIDED';

alter table patient_document
    drop column if exists is_verified;
