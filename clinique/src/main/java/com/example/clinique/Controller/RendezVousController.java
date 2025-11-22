package com.example.clinique.Controller;

import com.example.clinique.dto.RendezVousRequest;
import com.example.clinique.dto.CreateRendezVousDTO;
import com.example.clinique.entities.RendezVous;
import com.example.clinique.services.RendezVousService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/rendezvous")
public class RendezVousController {

    @Autowired
    private RendezVousService rendezVousService;

    // Endpoint principal - utilise patientId existant
    @PostMapping
    public RendezVous createRendezVous(@RequestBody CreateRendezVousDTO req) {
        System.out.println("🎯 Endpoint /rendezvous appelé: " + req);
        return rendezVousService.createRendezVousWithPatientId(req);
    }

    // Endpoint alternatif pour création avec infos patient complètes
    @PostMapping("/with-patient-info")
    public RendezVous createRendezVousWithPatientInfo(@RequestBody RendezVousRequest req) {
        System.out.println("🎯 Endpoint /with-patient-info appelé");
        return rendezVousService.createRendezVous(req);
    }
    // Endpoint pour récupérer les créneaux occupés d'un médecin pour une date
@GetMapping("/occupied-slots/{doctorId}/{date}")
public List<String> getOccupiedSlots(@PathVariable Integer doctorId, @PathVariable String date) {
    try {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(date, formatter);
        return rendezVousService.getOccupiedSlots(doctorId, localDate);
    } catch (Exception e) {
        return Collections.emptyList();
    }
}
}