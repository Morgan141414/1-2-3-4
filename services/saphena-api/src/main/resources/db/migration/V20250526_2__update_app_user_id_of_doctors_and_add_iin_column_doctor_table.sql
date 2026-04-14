alter table doctor
    drop constraint if exists doctor_user_id_fk;

alter table doctor
    alter column id drop default;

update app_user au
    set id = d.id
        from doctor d
            where au.id = d.user_id;

alter table doctor
    drop column user_id;

alter table doctor
    add constraint doctor_id_fk
        foreign key (id)
            references app_user(id);


alter table doctor
    add column if not exists iin char(12) unique;