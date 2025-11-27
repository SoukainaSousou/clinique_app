package com.example.clinique.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.clinique.entities.Medecin;
import com.example.clinique.dto.MedecinRequest;
import com.example.clinique.repository.MedecinRepository;
import com.example.clinique.services.UserService;

import java.util.*;

@RestController
@RequestMapping("/api/medecins")
@CrossOrigin(origins = "http://localhost:3000")
public class MedecinController {

    @Autowired
    private MedecinRepository medecinRepository;

    @Autowired
    private UserService userService;

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

    @GetMapping("/user/{userId}")
    public ResponseEntity<Medecin> getMedecinByUserId(@PathVariable Integer userId) {
        Optional<Medecin> medecinOpt = medecinRepository.findByUserId(userId);
        return medecinOpt.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    // ✅ ENDPOINT POUR METTRE À JOUR UN MÉDECIN
    @PutMapping("/{medecinId}")
    public ResponseEntity<?> updateMedecin(@PathVariable Integer medecinId, 
                                          @RequestBody MedecinRequest request) {
        System.out.println("🔄 Mise à jour médecin ID: " + medecinId);
        System.out.println("Données reçues: " + request);
        return userService.updateMedecin(medecinId, request);
    }

    // ✅ ENDPOINT POUR CRÉER UN MÉDECIN
    @PostMapping
    public ResponseEntity<?> createMedecin(@RequestBody MedecinRequest request) {
        System.out.println("➕ Création nouveau médecin");
        System.out.println("Données reçues: " + request);
        return userService.createMedecin(request);
    }

    // ✅ ENDPOINT POUR SUPPRIMER UN MÉDECIN
    @DeleteMapping("/{medecinId}")
    public ResponseEntity<?> deleteMedecin(@PathVariable Integer medecinId) {
        try {
            Optional<Medecin> medecinOpt = medecinRepository.findById(medecinId);
            if (medecinOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Medecin medecin = medecinOpt.get();
            medecinRepository.delete(medecin);
            
            return ResponseEntity.ok("Médecin supprimé avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la suppression: " + e.getMessage());
        }
    }

    // ✅ ENDPOINT POUR RÉCUPÉRER UN MÉDECIN PAR SON ID
    @GetMapping("/{medecinId}")
    public ResponseEntity<?> getMedecinById(@PathVariable Integer medecinId) {
        Optional<Medecin> medecinOpt = medecinRepository.findById(medecinId);
        if (medecinOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Medecin medecin = medecinOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", medecin.getId());
        response.put("image", medecin.getImage());
        response.put("experiences", medecin.getExperiences());
        response.put("languages", medecin.getLanguages());
        
        if (medecin.getSpecialite() != null) {
            response.put("specialiteId", medecin.getSpecialite().getId());
        }
        
        if (medecin.getUser() != null) {
            response.put("userId", medecin.getUser().getId());
            response.put("nom", medecin.getUser().getNom());
            response.put("prenom", medecin.getUser().getPrenom());
            response.put("email", medecin.getUser().getEmail());
        }

        return ResponseEntity.ok(response);
    }
}