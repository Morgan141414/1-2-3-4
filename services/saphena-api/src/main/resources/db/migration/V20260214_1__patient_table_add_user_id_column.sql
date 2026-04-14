alter table patient
    add column if not exists user_id uuid null;

alter table patient
    add constraint patient_user_fk
        foreign key (user_id)
            references app_user(id);

create unique index if not exists ux_patient_user_id_notnull
    on patient(user_id)
    where user_id is not null;
