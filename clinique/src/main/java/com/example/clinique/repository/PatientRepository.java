// src/main/java/com/example/clinique/repository/PatientRepository.java
package com.example.clinique.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.clinique.entities.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    Optional<Patient> findByEmail(String email);

    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.prenom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.cin) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Patient> searchByKeyword(@Param("keyword") String keyword);

    // ✅ Requête NATIVE
    @Query(value = "SELECT COUNT(DISTINCT r.patient_id) " +
                   "FROM rendez_vous r " +
                   "WHERE r.medecin_id = :medecinId", 
           nativeQuery = true)
    long countByMedecinId(@Param("medecinId") Long medecinId);

    // ❌ SUPPRIMER TOUTE AUTRE MÉTHODE
}