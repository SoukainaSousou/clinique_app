package com.example.clinique.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.clinique.entities.RendezVous;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {

    // Trouver tous les rendez-vous d'un médecin pour une date donnée
    @Query("SELECT r FROM RendezVous r WHERE r.medecin.id = :medecinId AND r.date = :date")
    List<RendezVous> findByMedecinAndDate(@Param("medecinId") Integer medecinId, @Param("date") LocalDate date);

    // Trouver tous les rendez-vous d'un médecin pour une date donnée (alias)
    @Query("SELECT r FROM RendezVous r WHERE r.medecin.id = :medecinId AND r.date = :date")
    List<RendezVous> findByMedecinIdAndDate(@Param("medecinId") Integer medecinId, @Param("date") LocalDate date);

    // NOUVELLE MÉTHODE : Trouver tous les rendez-vous d'un patient
    @Query("SELECT r FROM RendezVous r WHERE r.patient.id = :patientId ORDER BY r.date DESC, r.slot DESC")
    List<RendezVous> findByPatientId(@Param("patientId") Integer patientId);
}