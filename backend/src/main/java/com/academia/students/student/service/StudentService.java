package com.academia.students.student.service;

import com.academia.students.student.domain.Student;
import com.academia.students.student.dto.CreateStudentRequest;
import com.academia.students.student.dto.StudentResponse;
import com.academia.students.student.repository.StudentRepository;
import com.academia.students.shared.exception.DuplicateEmailException;
import com.academia.students.shared.exception.StudentNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class StudentService {
    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public StudentResponse create(CreateStudentRequest request) {
        if (repository.existsByEmail(request.email())) {
            throw new DuplicateEmailException();
        }
        var student = new Student(request.firstName(), request.lastName(), request.email());
        // La restricción UNIQUE también protege frente a solicitudes concurrentes.
        return StudentResponse.from(repository.saveAndFlush(student));
    }

    public StudentResponse findById(UUID id) {
        return repository.findById(id).map(StudentResponse::from)
                .orElseThrow(StudentNotFoundException::new);
    }

    public List<StudentResponse> findAll() {
        return repository.findAll(Sort.by("lastName", "firstName", "id"))
                .stream().map(StudentResponse::from).toList();
    }
}
