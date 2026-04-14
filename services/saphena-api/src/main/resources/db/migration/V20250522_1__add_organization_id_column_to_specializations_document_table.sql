alter table specialization_document
    add column if not exists organization_id uuid;

alter table specialization_document
    add constraint specialization_document_organization_id_fk
        foreign key (organization_id)
            references organization(id);