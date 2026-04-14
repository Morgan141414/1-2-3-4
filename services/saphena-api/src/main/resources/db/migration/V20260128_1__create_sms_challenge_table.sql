create table sms_challenge
(
    id                  uuid        not null primary key default gen_random_uuid(),
    phone               varchar(32) not null,
    purpose             varchar(32) not null,
    code_hash           text        not null,
    expires_at          timestamp   not null,
    attempts            int         not null default 0,
    status              varchar(16) not null,
    verified_at         timestamp,

    created_at          timestamp   not null default current_timestamp,
    created_by          varchar(255),
    updated_at          timestamp   not null default current_timestamp,
    updated_by          varchar(255),
    deleted             boolean     not null default false
);

create index idx_sms_challenge_phone_purpose
    on sms_challenge(phone, purpose);
create index idx_sms_challenge_created
    on sms_challenge(created_at);
create index idx_sms_challenge_expires
    on sms_challenge(expires_at);
