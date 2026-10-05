package com.academia.students.student.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Locale;

public record CreateStudentRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 80, message = "El nombre admite hasta 80 caracteres") String firstName,
        @NotBlank(message = "El apellido es obligatorio")
        @Size(max = 80, message = "El apellido admite hasta 80 caracteres") String lastName,
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "Ingresa un correo válido")
        @Size(max = 254, message = "El correo admite hasta 254 caracteres") String email) {

    public CreateStudentRequest {
        firstName = firstName == null ? null : firstName.strip();
        lastName = lastName == null ? null : lastName.strip();
        email = email == null ? null : email.strip().toLowerCase(Locale.ROOT);
    }
}
