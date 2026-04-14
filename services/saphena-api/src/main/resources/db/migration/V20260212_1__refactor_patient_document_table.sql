drop index if exists ux_patient_document_active;

alter table patient_document
    alter column document_number drop not null;

update patient_document
set
    document_number = null,
    updated_at = now(),
    updated_by = 'migration'
where is_active = true
  and deleted = false
  and document_number is not null
  and btrim(document_number) = '';

with ranked as (
    select
        id,
        row_number() over (
            partition by patient_id
            order by updated_at desc, created_at desc, id desc
            ) as rn
    from patient_document
    where is_active = true
      and deleted = false
)

update patient_document pd
set
    is_active = false,
    document_number = null,
    updated_at = now(),
    updated_by = 'migration'
from ranked r
where pd.id = r.id
    and r.rn > 1;

create unique index ux_patient_document_one_active_per_patient
on patient_document (patient_id)
where is_active = true
    and deleted = false;

create unique index ux_patient_document_number_active
on patient_document (document_number)
where document_number is not null
    and is_active = true
    and deleted = false;
