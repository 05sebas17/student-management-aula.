CREATE TABLE students (
    id UUID NOT NULL PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    email VARCHAR(254) NOT NULL,
    CONSTRAINT uk_students_email UNIQUE (email)
);
