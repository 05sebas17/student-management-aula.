package com.academia.students.student.controller;

import com.academia.students.student.dto.CreateStudentRequest;
import com.academia.students.student.dto.StudentResponse;
import com.academia.students.student.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/students")
public class StudentController {
    private final StudentService service;

    public StudentController(StudentService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<StudentResponse> create(@Valid @RequestBody CreateStudentRequest request) {
        var student = service.create(request);
        return ResponseEntity.created(URI.create("/students/" + student.id())).body(student);
    }

    @GetMapping("/{id}")
    public StudentResponse findById(@PathVariable UUID id) { return service.findById(id); }

    @GetMapping
    public List<StudentResponse> findAll() { return service.findAll(); }
}
