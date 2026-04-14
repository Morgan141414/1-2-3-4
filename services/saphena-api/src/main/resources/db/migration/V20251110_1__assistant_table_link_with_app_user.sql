insert into app_user (
    id,
    username,
    password,
    role,
    enabled,
    created_by,
    updated_by
)
select
    a.id,
    CONCAT('assistant_', a.id) as username,
    '$2a$10$1Q8oXuqj/yLEL3KveLZhdeMHlBa.OKBEvd7dHsDT6sl0ETuAalM9m' as password, -- bcrypt("password")
    'ASSISTANT',
    false,
    'system',
    'system'
from assistant a
where not exists (
    select 1 from app_user u where u.id = a.id
);