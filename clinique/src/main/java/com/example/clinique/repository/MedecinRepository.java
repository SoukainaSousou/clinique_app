package com.example.clinique.repository;

import com.example.clinique.entities.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MedecinRepository extends JpaRepository<Medecin, Integer> {
    Optional<Medecin> findByUserId(Integer userId);
    void deleteByUserId(Integer userId); // Cette méthode existe déjà, utilisez-la!
}