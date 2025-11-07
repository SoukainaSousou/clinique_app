package com.example.clinique.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*; // pour List, Map, ArrayList, HashMap

import com.example.clinique.entities.Medecin;
import com.example.clinique.repository.MedecinRepository;

@RestController
@RequestMapping("/api/medecins")
@CrossOrigin(origins = "http://localhost:3000") // adapte au port React
public class MedecinController {

    @Autowired
    private MedecinRepository medecinRepository;

    @GetMapping
    public List<Map<String, Object>> getAllMedecins() {
        List<Medecin> medecins = medecinRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Medecin m : medecins) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("nom", m.getUser().getNom());
            map.put("prenom", m.getUser().getPrenom());
            map.put("specialite", m.getSpecialite() != null ? m.getSpecialite().getNom() : "Non spécifiée");
            result.add(map);
        }
        return result;
    }
}
