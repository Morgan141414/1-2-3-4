alter table patient
    add unique (document_type, document_number);