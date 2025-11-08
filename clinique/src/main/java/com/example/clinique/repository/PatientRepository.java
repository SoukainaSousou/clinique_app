package com.example.clinique.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.clinique.entities.Patient;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
}
