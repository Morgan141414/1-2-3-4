alter table appointment
    add column if not exists room_id uuid;

alter table appointment
    add constraint appointment_room_id_fk
        foreign key (room_id)
            references room(id);

create index if not exists idx_appointment_room_id on appointment(room_id);
