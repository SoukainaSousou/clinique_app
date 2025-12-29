package com.example.clinique.services;

import com.example.clinique.dto.MedecinRequest;
import com.example.clinique.entities.Medecin;
import com.example.clinique.entities.Speciality;
import com.example.clinique.entities.User;
import com.example.clinique.repository.MedecinRepository;
import com.example.clinique.repository.SpecialityRepository;
import com.example.clinique.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private MedecinRepository medecinRepository;

    @Mock
    private SpecialityRepository specialityRepository;

    @InjectMocks
    private UserService userService;

    private User user;
    private Medecin medecin;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L); // ✅ Long
        user.setNom("Test");
        user.setPrenom("User");
        user.setEmail("test@test.com");
        user.setRole(User.Role.medecin);

        medecin = new Medecin();
        medecin.setId(1L); // ✅ Long
        medecin.setUser(user);
    }

    @Test
    void shouldReturnAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(user));
        List<User> result = userService.getAllUsers();
        assertEquals(1, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void shouldReturnUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user)); // ✅ 1L
        Optional<User> result = userService.getUserById(1L);
        assertTrue(result.isPresent());
        assertEquals("test@test.com", result.get().getEmail());
    }

    @Test
    void shouldSaveUser() {
        when(userRepository.save(user)).thenReturn(user);
        User saved = userService.saveUser(user);
        assertNotNull(saved);
        verify(userRepository).save(user);
    }

    @Test
    void shouldCreateMedecinSuccessfully() {
        MedecinRequest request = new MedecinRequest();
        request.setNom("Ali");
        request.setPrenom("Ahmed");
        request.setEmail("ali@test.com");
        request.setMot_de_passe("1234");
        request.setSpecialiteId(1L);

        Speciality speciality = new Speciality();
        speciality.setId(1L);

        when(userRepository.save(any(User.class))).thenReturn(user);
        when(specialityRepository.findById(1L)).thenReturn(Optional.of(speciality));
        when(medecinRepository.save(any(Medecin.class))).thenReturn(medecin);

        ResponseEntity<?> response = userService.createMedecin(request);
        assertEquals(200, response.getStatusCodeValue());
        verify(userRepository).save(any(User.class));
        verify(medecinRepository).save(any(Medecin.class));
    }

    @Test
    void shouldUpdateMedecinSuccessfully() {
        MedecinRequest request = new MedecinRequest();
        request.setNom("Updated");
        request.setPrenom("Name");
        request.setEmail("updated@test.com");
        request.setSpecialiteId(1L);

        Speciality speciality = new Speciality();
        speciality.setId(1L);

        when(medecinRepository.findById(1L)).thenReturn(Optional.of(medecin)); // ✅ 1L
        when(specialityRepository.findById(1L)).thenReturn(Optional.of(speciality));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(medecinRepository.save(any(Medecin.class))).thenReturn(medecin);

        ResponseEntity<?> response = userService.updateMedecin(1L, request); // ✅ 1L

        assertEquals(200, response.getStatusCodeValue());
        verify(userRepository).save(any(User.class));
        verify(medecinRepository).save(any(Medecin.class));
    }

    @Test
    void shouldReturn404WhenMedecinNotFound() {
        when(medecinRepository.findById(99L)).thenReturn(Optional.empty()); // ✅ 99L

        ResponseEntity<?> response = userService.updateMedecin(99L, new MedecinRequest());

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void shouldDeleteUserSuccessfully() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user)); // ✅ 1L
        when(medecinRepository.findByUserId(1L)).thenReturn(Optional.of(medecin)); // ✅ 1L

        ResponseEntity<?> response = userService.deleteUser(1L); // ✅ 1L

        assertEquals(200, response.getStatusCodeValue());
        verify(medecinRepository).delete(medecin);
        verify(userRepository).delete(user);
    }

    @Test
    void shouldReturn404WhenDeletingUnknownUser() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty()); // ✅ 99L

        ResponseEntity<?> response = userService.deleteUser(99L); // ✅ 99L

        assertEquals(404, response.getStatusCodeValue());
    }
}