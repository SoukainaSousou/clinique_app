package com.example.clinique.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.clinique.entities.Medecin;
import com.example.clinique.entities.RendezVous;
import com.example.clinique.dto.MedecinRequest;
import com.example.clinique.repository.*;
import com.example.clinique.services.UserService;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/medecins")
@CrossOrigin(origins = "http://localhost:3000")
public class MedecinController {

    @Autowired
    private MedecinRepository medecinRepository;

    @Autowired
    private UserService userService;

    // 🔷 Injection des repositories pour le dashboard
    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private PatientRepository patientRepository;

    // ✅ GET /api/medecins → Liste tous les médecins (public)
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

    // ✅ GET /api/medecins/user/{userId} → Profil médecin par userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<Medecin> getMedecinByUserId(@PathVariable Integer userId) {
        Optional<Medecin> medecinOpt = medecinRepository.findByUserId(userId);
        return medecinOpt.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    // ✅ GET /api/medecins/{medecinId} → Détail complet d’un médecin
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

    // ✅ POST /api/medecins → Créer un médecin
    @PostMapping
    public ResponseEntity<?> createMedecin(@RequestBody MedecinRequest request) {
        System.out.println("➕ Création nouveau médecin");
        System.out.println("Données reçues: " + request);
        return userService.createMedecin(request);
    }

    // ✅ PUT /api/medecins/{medecinId} → Mettre à jour médecin (admin)
    @PutMapping("/{medecinId}")
    public ResponseEntity<?> updateMedecin(@PathVariable Integer medecinId, 
                                          @RequestBody MedecinRequest request) {
        System.out.println("🔄 Mise à jour médecin ID: " + medecinId);
        System.out.println("Données reçues: " + request);
        return userService.updateMedecin(medecinId, request);
    }

    // ✅ PUT /api/medecins/{medecinId}/profil → Mettre à jour PROFL (médecin lui-même)
    @PutMapping("/{medecinId}/profil")
    public ResponseEntity<?> updateMedecinProfil(
        @PathVariable Integer medecinId,
        @RequestBody MedecinRequest request
    ) {
        return userService.updateMedecinProfil(medecinId, request);
    }

    // ✅ DELETE /api/medecins/{medecinId} → Supprimer un médecin
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

    
// src/main/java/com/example/clinique/Controller/MedecinController.java

@GetMapping("/dashboard/stats")
public Map<String, Object> getDashboardStats(@RequestParam Integer userId) {
    Optional<Medecin> medecinOpt = medecinRepository.findByUserId(userId);
    if (medecinOpt.isEmpty()) {
        throw new RuntimeException("Médecin non trouvé");
    }
    Integer medecinId = medecinOpt.get().getId();

    Map<String, Object> stats = new HashMap<>();
    LocalDate today = LocalDate.now();

    stats.put("totalPatients", patientRepository.countByMedecinId(medecinId));
    stats.put("rendezVousToday", rendezVousRepository.countByDateAndMedecinId(medecinId, today));
    stats.put("dossiersMedicaux", consultationRepository.countByMedecinId(medecinId));
    stats.put("consultationsActives", consultationRepository.countByMedecinIdAndTraitementIsNull(medecinId));
    
    return stats;
}

@GetMapping("/dashboard/chart-data")
public List<Map<String, Object>> getChartData(@RequestParam Integer userId) {
    Optional<Medecin> medecinOpt = medecinRepository.findByUserId(userId);
    if (medecinOpt.isEmpty()) {
        throw new RuntimeException("Médecin non trouvé");
    }
    Integer medecinId = medecinOpt.get().getId();

    List<Map<String, Object>> result = new ArrayList<>();
    LocalDate today = LocalDate.now();
    
    for (int i = 6; i >= 0; i--) {
        LocalDate date = today.minusDays(i);
        long count = consultationRepository.countByMedecinIdAndDate(medecinId, date);
        
        String shortDay = switch (date.getDayOfWeek()) {
            case MONDAY -> "Lun";
            case TUESDAY -> "Mar";
            case WEDNESDAY -> "Mer";
            case THURSDAY -> "Jeu";
            case FRIDAY -> "Ven";
            case SATURDAY -> "Sam";
            case SUNDAY -> "Dim";
            default -> "Jour";
        };
        
        result.add(Map.of("name", shortDay, "patients", (int) count));
    }
    
    return result;
}

// Dans MedecinController.java
@GetMapping("/medecin/rendezvous/{userId}")
public ResponseEntity<List<RendezVous>> getRendezVousByUserId(@PathVariable Integer userId) {
    Optional<Medecin> medecinOpt = medecinRepository.findByUserId(userId);
    if (medecinOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    Integer medecinId = medecinOpt.get().getId();

    List<RendezVous> rendezVousList = rendezVousRepository.findByMedecinId(medecinId);
    return ResponseEntity.ok(rendezVousList);
}

  



}