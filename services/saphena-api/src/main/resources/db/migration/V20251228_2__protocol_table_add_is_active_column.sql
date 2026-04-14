alter table protocol
add column if not exists is_active boolean;

update protocol
set is_active = true
where is_active is null;

update protocol p
set is_active = false
from (
    select id
    from (
        select id,
            row_number() over (
                partition by target_type, target_id, organization_id
                order by created_at desc
            ) as rn
        from protocol
    ) t
    where t.rn > 1
) sub
where p.id = sub.id;

alter table protocol
alter column is_active set not null;

-- один активный шаблон
create unique index if not exists ux_protocol_active_template
on protocol (target_type, target_id)
where organization_id is null and is_active = true;

-- один активный протокол организации
create unique index if not exists ux_protocol_active_org
on protocol (organization_id, target_type, target_id)
where is_active = true;

drop index if exists idx_protocol_document_id;

select target_type,
       target_id,
       organization_id,
       count(*) as active_count
from protocol
where is_active = true
group by target_type, target_id, organization_id
having count(*) > 1;




