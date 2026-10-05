package com.academia.students.student;

import com.academia.students.student.repository.StudentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.UUID;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class StudentApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired StudentRepository repository;
    @Autowired ObjectMapper mapper;

    @BeforeEach void cleanDatabase() { repository.deleteAll(); }

    @Test void createsAndRetrievesStudent() throws Exception {
        var result = mvc.perform(post("/students").contentType(MediaType.APPLICATION_JSON)
                .content("""
{"firstName":" Ana ","lastName":" Pérez ","email":" ANA@EXAMPLE.COM "}"""))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", startsWith("/students/")))
                .andExpect(jsonPath("$.firstName").value("Ana"))
                .andExpect(jsonPath("$.email").value("ana@example.com"))
                .andReturn();
        var id = mapper.readTree(result.getResponse().getContentAsString()).get("id").asText();
        mvc.perform(get("/students/" + id)).andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Pérez"));
        mvc.perform(get("/students")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(1)));
    }

    @Test void returnsEmptyList() throws Exception {
        mvc.perform(get("/students")).andExpect(status().isOk()).andExpect(content().json("[]"));
    }

    @Test void rejectsInvalidFields() throws Exception {
        mvc.perform(post("/students").contentType(MediaType.APPLICATION_JSON)
                .content("""
{"firstName":" ","lastName":"","email":"invalid"}"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").exists())
                .andExpect(jsonPath("$.errors.lastName").exists())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test void rejectsDuplicateEmailIgnoringCase() throws Exception {
        mvc.perform(post("/students").contentType(MediaType.APPLICATION_JSON)
                .content("""
{"firstName":"Ana","lastName":"Pérez","email":"ana@example.com"}"""))
                .andExpect(status().isCreated());
        mvc.perform(post("/students").contentType(MediaType.APPLICATION_JSON)
                .content("""
{"firstName":"Otra","lastName":"Persona","email":"ANA@EXAMPLE.COM"}"""))
                .andExpect(status().isConflict());
    }

    @Test void returns404ForMissingStudent() throws Exception {
        mvc.perform(get("/students/" + UUID.randomUUID())).andExpect(status().isNotFound());
    }

    @Test void rejectsMalformedId() throws Exception {
        mvc.perform(get("/students/not-a-uuid")).andExpect(status().isBadRequest());
    }

    @Test void rejectsMalformedJson() throws Exception {
        mvc.perform(post("/students").contentType(MediaType.APPLICATION_JSON).content("{oops"))
                .andExpect(status().isBadRequest());
    }

    @Test void rejectsMissingBody() throws Exception {
        mvc.perform(post("/students").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
