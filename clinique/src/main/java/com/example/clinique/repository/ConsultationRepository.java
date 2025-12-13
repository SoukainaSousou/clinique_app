package com.example.clinique.repository;

import com.example.clinique.entities.Consultation;
import com.example.clinique.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.example.clinique.dto.ConsultationDto;

public interface ConsultationRepository extends JpaRepository<Consultation, Integer> {

    /**
     * Retourne la liste des patients ayant consulté un médecin donné.
     * Utilise une sous-requête car Consultation ne contient que des IDs bruts (pas de relations JPA).
     */
    @Query("SELECT DISTINCT p FROM Patient p " +
           "WHERE p.id IN (SELECT c.patientId FROM Consultation c WHERE c.medecinId = :medecinId)")
    List<Patient> findPatientsByMedecinId(@Param("medecinId") Integer medecinId);

    /**
     * Retourne l'ID du médecin (table 'medecins') à partir de l'ID utilisateur (table 'users').
     * Nécessite que l'entité Medecin ait un champ 'user'.
     */
    @Query("SELECT m.id FROM Medecin m WHERE m.user.id = :userId")
    Integer findMedecinIdByUserId(@Param("userId") Integer userId);

    @Query("""
    SELECT new com.example.clinique.dto.ConsultationDto(
        c.id,
        c.dateConsultation,
        c.motif,
        c.traitement,
        c.fichier,
        m.id,
        u.nom,
        u.prenom,
        s.title
    )
    FROM Consultation c
    JOIN Medecin m ON c.medecinId = m.id
    JOIN User u ON m.user.id = u.id
    JOIN Speciality s ON m.specialite.id = s.id
    WHERE c.patientId = :patientId
    ORDER BY c.dateConsultation DESC
    """)
List<ConsultationDto> findConsultationsWithMedecinByPatientId(@Param("patientId") Integer patientId);
}