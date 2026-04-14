alter table patient
    add column iin_verified boolean not null default false;


insert into patient_document(
    id,
    patient_id,
    type,
    document_number,
    is_active,
    created_by,
    updated_by
)
select
    gen_random_uuid(),
    id,
    document_type,
    document_number,
    true,
    'system',
    'system'
from patient
where document_number is not null;


alter table patient
    drop column document_type,
    drop column document_number;


alter table patient
    add constraint chk_iin_length
        check (iin is null or length(iin) = 12);



