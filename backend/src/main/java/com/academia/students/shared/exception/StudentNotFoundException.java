package com.academia.students.shared.exception;

public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException() { super("No se encontró el estudiante solicitado."); }
}
