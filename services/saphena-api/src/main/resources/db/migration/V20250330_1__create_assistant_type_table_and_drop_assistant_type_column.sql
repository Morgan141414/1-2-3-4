create table if not exists assistant_type(
    assistant_id                uuid not null,
    type                        varchar(50) not null,

    constraint assistant_type_assistant_id_fk
        foreign key (assistant_id)
            references assistant(id)
);

insert into assistant_type(assistant_id, type)
select id, type from assistant;

alter table assistant drop column type;