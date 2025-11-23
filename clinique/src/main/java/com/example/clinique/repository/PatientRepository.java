package com.example.clinique.repository;

import com.example.clinique.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findByEmail(String email);

    // Recherche par mot-clé dans nom, prénom ou CIN (insensible à la casse)
    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.prenom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.cin) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Patient> searchByKeyword(@Param("keyword") String keyword);
}