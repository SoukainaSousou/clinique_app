package com.example.clinique.Controller;

import com.example.clinique.entities.Consultation;
import com.example.clinique.entities.Patient;
import com.example.clinique.dto.ConsultationDto;
import com.example.clinique.service.ConsultationService;  // Add this
import com.example.clinique.service.PatientService;      // Add this
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// CHANGED: Replace @WebMvcTest with @SpringBootTest
@SpringBootTest
@AutoConfigureMockMvc
class ConsultationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // CHANGED: Mock services instead of repositories
    @MockBean
    private ConsultationService consultationService;

    @MockBean
    private PatientService patientService;

    @Test
    void shouldReturnDossierPatient() throws Exception {
        Long patientId = 1L;
        Patient patient = new Patient();
        patient.setId(patientId);
        patient.setNom("Dupont");

        ConsultationDto dto = new ConsultationDto(
            1,
            LocalDateTime.now(),
            "Checkup",
            "",
            List.of(),
            10L,
            "Dupont",
            "Jean",
            "Cardiologie"
        );

        // CHANGED: Use service instead of repository
        when(patientService.getPatientById(patientId)).thenReturn(patient);
        when(consultationService.findConsultationsWithMedecinByPatientId(patientId))
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/consultations/dossier-patient/{patientId}", patientId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.patient.nom").value("Dupont"))
               .andExpect(jsonPath("$.consultations[0].motif").value("Checkup"));
    }

    @Test
    void shouldReturn404WhenPatientNotFound() throws Exception {
        Long patientId = 1L;
        
        // CHANGED: Throw exception or return null as your service would
        when(patientService.getPatientById(patientId))
            .thenThrow(new RuntimeException("Patient not found"));
            // OR: .thenReturn(null); depending on your implementation

        mockMvc.perform(get("/api/consultations/dossier-patient/{patientId}", patientId))
               .andExpect(status().isNotFound());
    }

    @Test
    void shouldAddNewConsultationWithoutFiles() throws Exception {
        Long patientId = 1L;
        Long medecinId = 2L;
        
        Consultation consultation = new Consultation();
        consultation.setId(1);
        
        // CHANGED: Mock the service method
        when(consultationService.addConsultationWithoutFiles(
            any(Long.class), 
            any(Long.class), 
            any(String.class),
            any(), // add other parameters as needed
            any()))
            .thenReturn(consultation);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/consultations/nouvelle")
                .param("patientId", patientId.toString())
                .param("medecinId", medecinId.toString())
                .param("motif", "Checkup"))
               .andExpect(status().isOk());
        
        verify(consultationService, times(1))
            .addConsultationWithoutFiles(any(Long.class), any(Long.class), any(String.class), any(), any());
    }

    @Test
    void shouldAddNewConsultationWithFiles() throws Exception {
        Long patientId = 1L;
        Long medecinId = 2L;
        
        Consultation consultation = new Consultation();
        consultation.setId(1);
        
        // CHANGED: Mock the service method for file upload
        when(consultationService.addConsultationWithFiles(
            any(Long.class), 
            any(Long.class), 
            any(String.class),
            any(), // add other parameters
            any(),
            any())) // for files
            .thenReturn(consultation);

        MockMultipartFile file = new MockMultipartFile(
                "fichiers",      // This must match the parameter name in your controller
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Hello World".getBytes()
        );

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/consultations/nouvelle")
                .file(file)
                .param("patientId", patientId.toString())
                .param("medecinId", medecinId.toString())
                .param("motif", "Checkup"))
               .andExpect(status().isOk());
        
        verify(consultationService, times(1))
            .addConsultationWithFiles(any(Long.class), any(Long.class), any(String.class), any(), any(), any());
    }
}