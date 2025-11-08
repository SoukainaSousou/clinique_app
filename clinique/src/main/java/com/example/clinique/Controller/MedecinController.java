package com.example.clinique.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.clinique.entities.Medecin;
import com.example.clinique.repository.MedecinRepository;

import java.util.*;

@RestController
@RequestMapping("/api/medecins")
@CrossOrigin(origins = "http://localhost:3000")
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
            map.put("image", m.getImage());
            map.put("experiences", m.getExperiences());
            map.put("languages", m.getLanguages() != null ? m.getLanguages().split(",") : new String[]{});
            
            if (m.getSpecialite() != null) {
                Map<String, Object> specialiteMap = new HashMap<>();
                specialiteMap.put("title", m.getSpecialite().getTitle());
                specialiteMap.put("description", m.getSpecialite().getDescription());
                specialiteMap.put("details", m.getSpecialite().getDetails());
                specialiteMap.put("iconName", m.getSpecialite().getIconName());
                map.put("specialite", specialiteMap);
            } else {
                map.put("specialite", null);
            }

            result.add(map);
        }
        return result;
    }
}
