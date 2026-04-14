create index idx_patient_iin on patient (iin);
create index idx_patient_name on patient (lower(first_name), lower(last_name));
