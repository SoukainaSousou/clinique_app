package com.example.clinique.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.example.clinique.entities.Patient;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findByEmail(String email);
}
