package com.example.clinique.Controller;

import com.example.clinique.dto.MedecinRequest;
import com.example.clinique.entities.Medecin;
import com.example.clinique.entities.User;
import com.example.clinique.repository.MedecinRepository;
import com.example.clinique.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MedecinController.class)
class MedecinControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MedecinRepository medecinRepository;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnAllMedecins() throws Exception {
        Medecin medecin = new Medecin();
        medecin.setId(1L);
        User user = new User();
        user.setNom("Jean");
        user.setPrenom("Dupont");
        medecin.setUser(user);
        when(medecinRepository.findAll()).thenReturn(List.of(medecin));

        mockMvc.perform(get("/api/medecins"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].id").value(1))
               .andExpect(jsonPath("$[0].nom").value("Jean"))
               .andExpect(jsonPath("$[0].prenom").value("Dupont"));
    }

    @Test
    void shouldReturnMedecinById() throws Exception {
        Medecin medecin = new Medecin();
        medecin.setId(1L);
        User user = new User();
        user.setNom("Jean");
        user.setPrenom("Dupont");
        user.setEmail("jean.dupont@test.com");
        medecin.setUser(user);

        when(medecinRepository.findById(1L)).thenReturn(Optional.of(medecin));

        mockMvc.perform(get("/api/medecins/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.id").value(1))
               .andExpect(jsonPath("$.nom").value("Jean"))
               .andExpect(jsonPath("$.prenom").value("Dupont"))
               .andExpect(jsonPath("$.email").value("jean.dupont@test.com"));
    }

    @Test
    void shouldReturn404WhenMedecinNotFound() throws Exception {
        when(medecinRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/medecins/99"))
               .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturnMedecinByUserId() throws Exception {
        Medecin medecin = new Medecin();
        medecin.setId(1L);
        when(medecinRepository.findByUserId(1L)).thenReturn(Optional.of(medecin));

        mockMvc.perform(get("/api/medecins/user/1"))
               .andExpect(status().isOk());
    }



    @Test
    void shouldDeleteMedecin() throws Exception {
        Medecin medecin = new Medecin();
        medecin.setId(1L);
        when(medecinRepository.findById(1L)).thenReturn(Optional.of(medecin));

        mockMvc.perform(delete("/api/medecins/1"))
               .andExpect(status().isOk())
               .andExpect(content().string("Médecin supprimé avec succès"));

        verify(medecinRepository).delete(medecin);
    }

    @Test
    void shouldReturn404WhenDeletingNonExistingMedecin() throws Exception {
        when(medecinRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/medecins/99"))
               .andExpect(status().isNotFound());
    }
}