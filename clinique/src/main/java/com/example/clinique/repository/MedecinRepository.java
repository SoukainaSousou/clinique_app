// src/main/java/com/example/clinique/repository/MedecinRepository.java
package com.example.clinique.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.clinique.entities.Medecin;

public interface MedecinRepository extends JpaRepository<Medecin, Long> {
    Optional<Medecin> findByUserId(Long userId);
    
    // ❌ SUPPRIMEZ findIdByUserId (pas nécessaire, utilisez medecinOpt.get().getId())
}