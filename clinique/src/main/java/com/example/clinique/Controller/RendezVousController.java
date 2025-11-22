package com.example.clinique.Controller;

import com.example.clinique.dto.RendezVousRequest;
import com.example.clinique.dto.CreateRendezVousDTO;
import com.example.clinique.entities.RendezVous;
import com.example.clinique.services.RendezVousService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    
}