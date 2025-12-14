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
import java.util.Map;
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

    // ----------------- GET patients by medecin -----------------
    @Test
    void shouldReturnPatientsByMedecin() throws Exception {
        Integer medecinId = 1;
        Patient p1 = new Patient();
        p1.setId(1);
        p1.setNom("Dupont");
        Patient p2 = new Patient();
        p2.setId(2);
        p2.setNom("Martin");

        when(consultationRepository.findPatientsByMedecinId(medecinId))
                .thenReturn(List.of(p1, p2));

        mockMvc.perform(get("/api/consultations/patients/par-medecin/{medecinId}", medecinId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].nom").value("Dupont"))
               .andExpect(jsonPath("$[1].nom").value("Martin"));

        verify(consultationRepository, times(1)).findPatientsByMedecinId(medecinId);
    }

    // ----------------- GET medecin ID by user ID -----------------
    @Test
    void shouldReturnMedecinIdByUserId() throws Exception {
        Integer userId = 10;
        Integer medecinId = 5;

        when(consultationRepository.findMedecinIdByUserId(userId)).thenReturn(medecinId);

        mockMvc.perform(get("/api/consultations/medecin-id-par-user/{userId}", userId))
               .andExpect(status().isOk())
               .andExpect(content().string(medecinId.toString()));

        verify(consultationRepository, times(1)).findMedecinIdByUserId(userId);
    }

    @Test
    void shouldReturn404WhenMedecinIdNotFound() throws Exception {
        Integer userId = 10;

        when(consultationRepository.findMedecinIdByUserId(userId)).thenReturn(null);

        mockMvc.perform(get("/api/consultations/medecin-id-par-user/{userId}", userId))
               .andExpect(status().isNotFound());

        verify(consultationRepository, times(1)).findMedecinIdByUserId(userId);
    }

    // ----------------- GET dossier patient -----------------
    @Test
    void shouldReturnDossierPatient() throws Exception {
        Integer patientId = 1;
        Patient patient = new Patient();
        patient.setId(patientId);
        patient.setNom("Dupont");

       ConsultationDto dto = new ConsultationDto(
    1,                                  // id
    LocalDateTime.now(),                // dateConsultation
    "Checkup",                          // motif
    "",                                 // traitement
    List.of(),                          // fichier
    10,                                 // medecinId
    "Dupont",                           // medecinNom
    "Jean",                             // medecinPrenom
    "Cardiologie"                       // specialite
);

       

        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(consultationRepository.findConsultationsWithMedecinByPatientId(patientId))
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/consultations/dossier-patient/{patientId}", patientId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.patient.nom").value("Dupont"))
               .andExpect(jsonPath("$.consultations[0].motif").value("Checkup"));

        verify(patientRepository, times(1)).findById(patientId);
        verify(consultationRepository, times(1)).findConsultationsWithMedecinByPatientId(patientId);
    }

    @Test
    void shouldReturn404WhenPatientNotFound() throws Exception {
        Integer patientId = 1;
        when(patientRepository.findById(patientId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/consultations/dossier-patient/{patientId}", patientId))
               .andExpect(status().isNotFound());

        verify(patientRepository, times(1)).findById(patientId);
        verify(consultationRepository, never()).findConsultationsWithMedecinByPatientId(any());
    }

    // ----------------- POST nouvelle consultation -----------------
    @Test
    void shouldAddNewConsultationWithoutFiles() throws Exception {
        Integer patientId = 1;
        Integer medecinId = 2;

        Consultation consultation = new Consultation();
        consultation.setPatientId(patientId);
        consultation.setMedecinId(medecinId);
        consultation.setMotif("Checkup");

        when(consultationRepository.save(any(Consultation.class))).thenReturn(consultation);

        mockMvc.perform(multipart("/api/consultations/nouvelle")
                .param("patientId", patientId.toString())
                .param("medecinId", medecinId.toString())
                .param("motif", "Checkup"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.motif").value("Checkup"));

        verify(consultationRepository, times(1)).save(any(Consultation.class));
    }

    @Test
    void shouldAddNewConsultationWithFiles() throws Exception {
        Integer patientId = 1;
        Integer medecinId = 2;

        MockMultipartFile file = new MockMultipartFile(
                "fichiers",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Hello World".getBytes()
        );

        Consultation consultation = new Consultation();
        consultation.setPatientId(patientId);
        consultation.setMedecinId(medecinId);
        consultation.setMotif("Checkup");
        consultation.setFichier(List.of("test.txt"));

        when(consultationRepository.save(any(Consultation.class))).thenReturn(consultation);

        mockMvc.perform(multipart("/api/consultations/nouvelle")
                .file(file)
                .param("patientId", patientId.toString())
                .param("medecinId", medecinId.toString())
                .param("motif", "Checkup"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.motif").value("Checkup"));

        verify(consultationRepository, times(1)).save(any(Consultation.class));
    }
}
