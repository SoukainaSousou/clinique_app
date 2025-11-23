package com.example.clinique.Controller;

import com.example.clinique.dto.RendezVousRequest;
import com.example.clinique.dto.CreateRendezVousDTO;
import com.example.clinique.entities.RendezVous;
import com.example.clinique.services.RendezVousService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/rendezvous")
public class RendezVousController {

    @Autowired
    private RendezVousService rendezVousService;

    @GetMapping
    public List<RendezVous> getAllRendezVous() {
        System.out.println("🎯 Endpoint GET /rendezvous appelé - Récupération de tous les rendez-vous");
        List<RendezVous> rendezVousList = rendezVousService.getAllRendezVous();
        System.out.println("✅ Nombre de rendez-vous trouvés: " + rendezVousList.size());
        return rendezVousList;
    }

    // ENDPOINT CORRIGÉ - Utilise Long
    @GetMapping("/{id}")
    public ResponseEntity<RendezVous> getRendezVousById(@PathVariable Long id) {
        System.out.println("🎯 Endpoint GET /rendezvous/" + id + " appelé");
        try {
            RendezVous rendezVous = rendezVousService.getRendezVousById(id);
            return ResponseEntity.ok(rendezVous);
        } catch (RuntimeException e) {
            System.out.println("❌ Rendez-vous non trouvé avec ID: " + id);
            return ResponseEntity.notFound().build();
        }
    }

    // Ajoutez aussi les endpoints PUT et DELETE
    @PutMapping("/{id}")
    public ResponseEntity<RendezVous> updateRendezVous(@PathVariable Long id, @RequestBody CreateRendezVousDTO req) {
        System.out.println("🎯 Endpoint PUT /rendezvous/" + id + " appelé");
        try {
            RendezVous updatedRendezVous = rendezVousService.updateRendezVous(id, req);
            return ResponseEntity.ok(updatedRendezVous);
        } catch (RuntimeException e) {
            System.out.println("❌ Erreur modification rendez-vous: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        System.out.println("🎯 Endpoint DELETE /rendezvous/" + id + " appelé");
        try {
            rendezVousService.deleteRendezVous(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            System.out.println("❌ Erreur suppression rendez-vous: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public RendezVous createRendezVous(@RequestBody CreateRendezVousDTO req) {
        System.out.println("🎯 Endpoint /rendezvous appelé: " + req);
        return rendezVousService.createRendezVousWithPatientId(req);
    }

    @PostMapping("/with-patient-info")
    public RendezVous createRendezVousWithPatientInfo(@RequestBody RendezVousRequest req) {
        System.out.println("🎯 Endpoint /with-patient-info appelé");
        return rendezVousService.createRendezVous(req);
    }

<<<<<<< HEAD
    // Endpoint pour récupérer les créneaux occupés d'un médecin pour une date
=======
>>>>>>> 7534d52482f599de4ed8c12c0b97afc0c8988395
    @GetMapping("/occupied-slots/{doctorId}/{date}")
    public List<String> getOccupiedSlots(@PathVariable Integer doctorId, @PathVariable String date) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate localDate = LocalDate.parse(date, formatter);
            return rendezVousService.getOccupiedSlots(doctorId, localDate);
        } catch (Exception e) {
            return Collections.emptyList();
        }
<<<<<<< HEAD
    }

    // NOUVEL ENDPOINT : Récupérer les rendez-vous d'un patient
    @GetMapping("/patient/{patientId}")
    public List<RendezVous> getRendezVousByPatient(@PathVariable Integer patientId) {
        System.out.println("🎯 Récupération des rendez-vous pour patient ID: " + patientId);
        return rendezVousService.getRendezVousByPatientId(patientId);
=======
>>>>>>> 7534d52482f599de4ed8c12c0b97afc0c8988395
    }
}