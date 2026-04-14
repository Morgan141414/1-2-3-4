alter table appointment
    add column if not exists end_datetime timestamp;