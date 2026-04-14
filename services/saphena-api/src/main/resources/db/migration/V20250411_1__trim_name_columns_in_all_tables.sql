update assistant
set first_name = trim(first_name),
    last_name = trim(last_name),
    middle_name = trim(middle_name);

update doctor
set first_name = trim(first_name),
    last_name = trim(last_name),
    middle_name = trim(middle_name);

update organization_document
set name = trim(name);

update organization_document_protocol
set template = trim(template);

update organization
set clinic_name = trim(clinic_name),
    organization_name = trim(organization_name),
    address = trim(address),
    phone = trim(phone),
    email = trim(email);

update patient
set iin = trim(iin),
    document_number = trim(iin),
    first_name = trim(first_name),
    last_name = trim(last_name),
    middle_name = trim(middle_name),
    address = trim(address),
    phone = trim(phone),
    emergency_contact = trim(emergency_contact),
    email = trim(email);

update procedure
set name = trim(name);

update procedure_protocol
set template = trim(template);

update specialization_document
set name = trim(name);

update specialization_document_protocol
set template = trim(template);

update specialization
set name = trim(name);

update consultation_protocol
set template = trim(template);

update app_user
set username = lower(trim(username));