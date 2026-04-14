alter table doctor_procedure
    add column if not exists doc_spec_id uuid;

update doctor_procedure dp
set doc_spec_id = ds.id
from doctor_specialization ds
where ds.organization_id = dp.organization_id
    and ds.specialization_id = dp.specialization_id
    and ds.doctor_id = dp.doctor_id;

alter table doctor_procedure
    alter column doc_spec_id set not null;
