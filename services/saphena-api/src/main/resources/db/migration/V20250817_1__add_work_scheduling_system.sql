CREATE TABLE work_schedule
(
    id          UUID                  DEFAULT gen_random_uuid() PRIMARY KEY,
    org_user_id UUID         NOT NULL,
    name        VARCHAR(255) NOT NULL,
    start_date  DATE         NOT NULL,
    end_date    DATE,

    created_at  TIMESTAMP    NOT NULL DEFAULT current_timestamp,
    created_by  VARCHAR(120) NOT NULL,
    updated_at  TIMESTAMP    NOT NULL DEFAULT current_timestamp,
    updated_by  VARCHAR(120) NOT NULL,
    deleted     BOOLEAN      NOT NULL DEFAULT false,

    CONSTRAINT work_schedule_org_user_id_fk
        FOREIGN KEY (org_user_id)
            REFERENCES organization_user (id)
);

CREATE TABLE work_pattern
(
    id                  UUID                  DEFAULT gen_random_uuid() PRIMARY KEY,
    schedule_id         UUID         NOT NULL,
    weekday             VARCHAR(10)  NOT NULL CHECK (weekday IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY',
                                                                 'SATURDAY', 'SUNDAY')),
    start_time          TIME         NOT NULL,
    end_time            TIME         NOT NULL,

    created_at          TIMESTAMP    NOT NULL DEFAULT current_timestamp,
    created_by          VARCHAR(120) NOT NULL,
    updated_at          TIMESTAMP    NOT NULL DEFAULT current_timestamp,
    updated_by          VARCHAR(120) NOT NULL,
    deleted             BOOLEAN      NOT NULL DEFAULT false,

    CONSTRAINT work_pattern_schedule_id_fk
        FOREIGN KEY (schedule_id)
            REFERENCES work_schedule (id)
);

CREATE TABLE schedule_exception
(
    id          UUID                  DEFAULT gen_random_uuid() PRIMARY KEY,
    org_user_id UUID         NOT NULL,
    start_date  DATE         NOT NULL,
    end_date    DATE         NOT NULL,
    note        TEXT,

    created_at  TIMESTAMP    NOT NULL DEFAULT current_timestamp,
    created_by  VARCHAR(120) NOT NULL,
    updated_at  TIMESTAMP    NOT NULL DEFAULT current_timestamp,
    updated_by  VARCHAR(120) NOT NULL,
    deleted     BOOLEAN      NOT NULL DEFAULT false,

    CONSTRAINT schedule_exception_org_user_id_fk
        FOREIGN KEY (org_user_id)
            REFERENCES organization_user (id)
);
