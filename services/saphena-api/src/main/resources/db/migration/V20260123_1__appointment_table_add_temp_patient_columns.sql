alter table appointment
    add column if not exists temp_patient_name  varchar(255),
    add column if not exists temp_patient_phone varchar(50);

create index idx_appointment_temp_patient_name
    on appointment (lower(temp_patient_name));

create index idx_appointment_temp_patient_phone
    on appointment (temp_patient_phone);