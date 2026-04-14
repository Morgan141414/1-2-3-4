alter table room_procedure
add column if not exists org_procedure_id uuid;

alter table room_procedure
drop column if exists organization_id,
drop column if exists procedure_id;

truncate table room_procedure;

alter table room_procedure
    alter column org_procedure_id set not null;

alter table room_procedure
    add constraint fk_room_procedure_org_proc
        foreign key (org_procedure_id)
            references organization_procedure(id);

alter table room_procedure
    add constraint ux_room_org_procedure
        unique (room_id, org_procedure_id);
