alter table doctor_assistant
    add column if not exists org_user_id uuid;

update doctor_assistant da
set org_user_id = ou.id
from assistant a,
     organization_user ou
where a.id = da.assistant_id
    and ou.user_id = da.doctor_id
    and ou.organization_id = a.organization_id;

alter table doctor_assistant
    alter column org_user_id set not null;


alter table doctor_specialization
    add column if not exists org_user_id uuid;

update doctor_specialization ds
set org_user_id = ou.id
from organization_user ou
where ou.organization_id = ds.organization_id
    and ou.user_id = ds.doctor_id;

alter table doctor_specialization
    alter column org_user_id set not null;


alter table appointment
    add column if not exists org_user_id uuid;

update appointment a
set org_user_id = ou.id
from organization_user ou
where ou.organization_id = a.organization_id
  and ou.user_id = a.doctor_id;

alter table appointment
    alter column org_user_id set not null;
