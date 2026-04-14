alter table protocol_data
    add constraint protocol_data_appointment_id_protocol_id_unique
        unique (appointment_id, protocol_id);