update appointment
set client_ownership = 'DOCTOR'
    where client_ownership = 'STAFF';

update kpi_event
set client_ownership_type = 'DOCTOR'
    where client_ownership_type = 'STAFF';
