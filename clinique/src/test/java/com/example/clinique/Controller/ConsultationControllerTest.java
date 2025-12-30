package com.example.clinique.Controller;

import com.example.clinique.entities.Consultation;
import com.example.clinique.entities.Patient;
import com.example.clinique.dto.ConsultationDto;
import com.example.clinique.repository.ConsultationRepository;
import com.example.clinique.repository.PatientRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ConsultationController.class)
class ConsultationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ConsultationRepository consultationRepository;

    @MockBean
    private PatientRepository patientRepository;

    @Test
    void shouldReturnDossierPatient() throws Exception {
        Long patientId = 1L;
        Patient patient = new Patient();
        patient.setId(patientId);
        patient.setNom("Dupont");

        ConsultationDto dto = new ConsultationDto(
            1,                    // ✅ Integer → car Consultation.id = Integer
            LocalDateTime.now(),
            "Checkup",
            "",
            List.of(),
            10L,                  // ✅ Long → car c'est medecin.id ou similaire
            "Dupont",
            "Jean",
            "Cardiologie"
        );

        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(consultationRepository.findConsultationsWithMedecinByPatientId(patientId))
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/consultations/dossier-patient/{patientId}", patientId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.patient.nom").value("Dupont"))
               .andExpect(jsonPath("$.consultations[0].motif").value("Checkup"));
    }

    @Test
    void shouldReturn404WhenPatientNotFound() throws Exception {
        Long patientId = 1L;
        when(patientRepository.findById(patientId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/consultations/dossier-patient/{patientId}", patientId))
               .andExpect(status().isNotFound());
    }

    @Test
    void shouldAddNewConsultationWithoutFiles() throws Exception {
        Long patientId = 1L;
        Long medecinId = 2L;

        mockMvc.perform(multipart("/api/consultations/nouvelle")
                .param("patientId", patientId.toString())
                .param("medecinId", medecinId.toString())
                .param("motif", "Checkup"))
               .andExpect(status().isOk());
    }

    @Test
    void shouldAddNewConsultationWithFiles() throws Exception {
        Long patientId = 1L;
        Long medecinId = 2L;

        MockMultipartFile file = new MockMultipartFile(
                "fichiers",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Hello World".getBytes()
        );

        mockMvc.perform(multipart("/api/consultations/nouvelle")
                .file(file)
                .param("patientId", patientId.toString())
                .param("medecinId", medecinId.toString())
                .param("motif", "Checkup"))
               .andExpect(status().isOk());
    }
}