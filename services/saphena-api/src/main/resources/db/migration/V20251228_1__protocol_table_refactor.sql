alter table protocol
drop column if exists organization_document_id,
drop column if exists specialization_document_id,
drop column if exists procedure_id;

alter table protocol
alter column organization_id drop not null;

do $$
    begin
        if exists (
            select 1
            from information_schema.columns
            where table_name = 'protocol'
              and column_name = 'type'
        ) then
            alter table protocol
                rename column type to target_type;
        end if;

        if exists (
            select 1
            from information_schema.columns
            where table_name = 'protocol'
              and column_name = 'document_id'
        ) then
            alter table protocol
                rename column document_id to target_id;
        end if;
    end
$$;
