package com.academia.students.student.dto;

import com.academia.students.student.domain.Student;
import java.util.UUID;

public record StudentResponse(UUID id, String firstName, String lastName, String email) {
    public static StudentResponse from(Student student) {
        return new StudentResponse(student.getId(), student.getFirstName(), student.getLastName(), student.getEmail());
    }
}
