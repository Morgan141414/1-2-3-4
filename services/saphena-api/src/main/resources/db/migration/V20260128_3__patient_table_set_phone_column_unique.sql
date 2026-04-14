with ranked as (
    select
        id,
        phone,
        row_number() over (partition by phone order by id) as rn
    from patient
    where phone is not null
)


update patient p
set phone = null
from ranked r
where p.id = r.id
  and r.rn > 1;


create unique index if not exists ux_patient_phone_not_null
    on patient (phone)
    where phone is not null;