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
    long countByMedecinIdAndDate(Long medecinId, LocalDate date);

    // ⚠️ Supprimez la version redondante avec Integer → utilisez Long (car ID = Long dans l'entité)
    
    // ✅ Version JPQL (recommandée) – pas de nom de table
    @Query("SELECT COUNT(r) FROM RendezVous r WHERE r.medecin.id = :medecinId AND r.date = :date")
    long countByDateAndMedecinId(@Param("medecinId") Long medecinId, @Param("date") LocalDate date);

    // ✅ Version native – CORRIGÉE avec `rendez_vous`
    @Query(value = "SELECT COUNT(*) FROM rendez_vous r " +
                   "WHERE r.medecin_id = :medecinId AND r.date = :date", 
           nativeQuery = true)
    long countByDateAndMedecinIdNative(@Param("medecinId") Long medecinId, @Param("date") LocalDate date);

    // ✅ Méthodes dérivées – utilisez `Long` pour les ID (cohérent avec @Id Long)
    List<RendezVous> findByMedecinId(Long medecinId);
    List<RendezVous> findByPatientId(Long patientId);

    // ✅ JPQL : par date et médecin
    @Query("SELECT r FROM RendezVous r WHERE r.medecin.id = :medecinId AND r.date = :date")
    List<RendezVous> findByMedecinIdAndDate(@Param("medecinId") Long medecinId, @Param("date") LocalDate date);

    // ✅ Native – CORRIGÉE
    @Query(value = "SELECT * FROM rendez_vous r WHERE r.medecin_id = :medecinId AND r.date = :date", nativeQuery = true)
    List<RendezVous> findNativeByMedecinIdAndDate(@Param("medecinId") Long medecinId, @Param("date") LocalDate date);
}