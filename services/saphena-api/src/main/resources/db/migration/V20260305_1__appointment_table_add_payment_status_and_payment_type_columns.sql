alter table appointment
    add column if not exists payment_status varchar(50) not null default 'UNPAID',
    add column if not exists payment_type varchar(50) not null default 'NOT_DEFINED';
