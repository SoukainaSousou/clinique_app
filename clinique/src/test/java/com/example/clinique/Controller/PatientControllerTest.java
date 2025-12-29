package com.example.clinique.Controller;

import com.example.clinique.entities.Patient;
import com.example.clinique.repository.PatientRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PatientController.class)
class PatientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PatientRepository patientRepository;

    @Test
    void shouldReturnAllPatients() throws Exception {
        Patient patient = new Patient();
        patient.setId(1L); // ✅ Long
        patient.setNom("Dupont");

        when(patientRepository.findAll()).thenReturn(List.of(patient));

        mockMvc.perform(get("/api/patients"))
               .andExpect(status().isOk());
    }

    @Test
    void shouldReturnPatientById() throws Exception {
        Patient patient = new Patient();
        patient.setId(1L); // ✅ Long

        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient)); // ✅ 1L

        mockMvc.perform(get("/api/patients/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void shouldReturn404WhenPatientNotFound() throws Exception {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty()); // ✅ 99L

        mockMvc.perform(get("/api/patients/99"))
               .andExpect(status().isNotFound()); // ✅ isNotFound(), pas isOk()
    }

    @Test
    void shouldAddPatient() throws Exception {
        Patient patient = new Patient();
        patient.setNom("Dupont");

        when(patientRepository.save(any(Patient.class))).thenReturn(patient);

        mockMvc.perform(post("/api/patients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(patient)))
               .andExpect(status().isOk());
    }

    @Test
    void shouldUpdatePatient() throws Exception {
        Patient existing = new Patient();
        existing.setId(1L);
        Patient updated = new Patient();
        updated.setNom("New");

        when(patientRepository.findById(1L)).thenReturn(Optional.of(existing)); // ✅ 1L
        when(patientRepository.save(any(Patient.class))).thenReturn(updated);

        mockMvc.perform(put("/api/patients/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
               .andExpect(status().isOk());
    }

    @Test
    void shouldDeletePatient() throws Exception {
        when(patientRepository.existsById(1L)).thenReturn(true); // ✅ 1L
        doNothing().when(patientRepository).deleteById(1L); // ✅ 1L

        mockMvc.perform(delete("/api/patients/1"))
               .andExpect(status().isOk());
    }

    @Test
    void shouldReturnPatientByEmail() throws Exception {
        Patient patient = new Patient();
        patient.setEmail("test@test.com");
        when(patientRepository.findByEmail("test@test.com")).thenReturn(Optional.of(patient));

        mockMvc.perform(get("/api/patients/email/test@test.com"))
               .andExpect(status().isOk());
    }
}