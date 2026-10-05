package com.academia.students.shared.exception;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException() { super("Ya existe un estudiante con ese correo electrónico."); }
}
