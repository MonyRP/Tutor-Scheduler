use tutor_scheduler;
-- tables
-- Table: appointment
CREATE TABLE appointment (
    appointment_id int NOT NULL AUTO_INCREMENT,
    students_banner_id int NOT NULL,
    tutors_banner_id int NOT NULL,
    day varchar(14) NOT NULL,
    start_time time NOT NULL,
    description text NULL,
    CONSTRAINT appointment_pk PRIMARY KEY (appointment_id)
);

-- Table: students
CREATE TABLE students (
    banner_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(70) NOT NULL,
    last_name varchar(70) NOT NULL,
    email varchar(120) NOT NULL,
    password varchar(128) NOT NULL,
    CONSTRAINT students_pk PRIMARY KEY (banner_id)
);

-- Table: tutor_schedule
CREATE TABLE tutor_schedule (
    tutor_schedule_id int NOT NULL AUTO_INCREMENT,
    tutors_banner_id int NOT NULL,
    day varchar(14) NOT NULL,
    start_time time NOT NULL,
    booked bool NOT NULL,
    CONSTRAINT tutor_schedule_pk PRIMARY KEY (tutor_schedule_id)
);

-- Table: tutors
CREATE TABLE tutors (
    banner_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(70) NOT NULL,
    last_name varchar(70) NOT NULL,
    email varchar(120) NOT NULL,
    password varchar(128) NOT NULL,
    CONSTRAINT tutors_pk PRIMARY KEY (banner_id)
);

-- foreign keys
-- Reference: appointment_students (table: appointment)
ALTER TABLE appointment ADD CONSTRAINT appointment_students FOREIGN KEY appointment_students (students_banner_id)
    REFERENCES students (banner_id);

-- Reference: appointment_tutors (table: appointment)
ALTER TABLE appointment ADD CONSTRAINT appointment_tutors FOREIGN KEY appointment_tutors (tutors_banner_id)
    REFERENCES tutors (banner_id);

-- Reference: tutor_schedule_tutors (table: tutor_schedule)
ALTER TABLE tutor_schedule ADD CONSTRAINT tutor_schedule_tutors FOREIGN KEY tutor_schedule_tutors (tutors_banner_id)
    REFERENCES tutors (banner_id);

-- End of file.

