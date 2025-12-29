package com.example.clinique.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.clinique.entities.Medecin;
import com.example.clinique.entities.RendezVous;
import com.example.clinique.dto.MedecinRequest;
import com.example.clinique.repository.*;
import com.example.clinique.services.UserService;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

    // 📁 Dossier d'upload (à la racine du projet ou dans target/)
    private final Path rootLocation = Paths.get("uploads");

    // ✅ Initialisation du dossier uploads
    public MedecinController() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload: " + e.getMessage());
        }
    }

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
    public ResponseEntity<Medecin> getMedecinByUserId(@PathVariable Long userId) {
        Optional<Medecin> medecinOpt = medecinRepository.findByUserId(userId);
        return medecinOpt.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    // ✅ GET /api/medecins/{medecinId} → Détail complet d’un médecin
    @GetMapping("/{medecinId}")
    public ResponseEntity<?> getMedecinById(@PathVariable Long medecinId) {
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
    public ResponseEntity<?> updateMedecin(@PathVariable Long medecinId, 
                                          @RequestBody MedecinRequest request) {
        System.out.println("🔄 Mise à jour médecin ID: " + medecinId);
        System.out.println("Données reçues: " + request);
        return userService.updateMedecin(medecinId, request);
    }

    // ✅ ⬇️ NOUVELLE MÉTHODE : PUT /api/medecins/{medecinId}/profil (avec upload)
    @PutMapping(value = "/{medecinId}/profil", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMedecinProfilWithImage(
        @PathVariable Long medecinId,
        @RequestParam(required = false) String experiences,
        @RequestParam(required = false) String languages,
        @RequestParam(required = false) MultipartFile image
    ) {
        try {
            Optional<Medecin> medecinOpt = medecinRepository.findById(medecinId);
            if (medecinOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Medecin medecin = medecinOpt.get();

            // 🖋️ Mettre à jour les champs texte
            if (experiences != null) medecin.setExperiences(experiences);
            if (languages != null) medecin.setLanguages(languages);

            // 🖼️ Gérer l'upload d'image
            if (image != null && !image.isEmpty()) {
                try {
                    // Générer un nom unique
                    String filename = UUID.randomUUID().toString() + "."
                            + StringUtils.getFilenameExtension(image.getOriginalFilename());
                    
                    // Sauvegarder le fichier
                    Path destinationFile = this.rootLocation.resolve(filename).normalize().toAbsolutePath();
                    image.transferTo(destinationFile);

                    // Stocker le chemin relatif dans la base
                    medecin.setImage("uploads/" + filename);
                } catch (IOException e) {
                    return ResponseEntity.badRequest().body("Erreur lors de l'upload de l'image: " + e.getMessage());
                }
            }

            // 💾 Sauvegarder
            medecinRepository.save(medecin);
            return ResponseEntity.ok("Profil mis à jour avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur serveur: " + e.getMessage());
        }
    }

    // ✅ (Optionnel) Servir les fichiers uploadés
    @GetMapping("/uploads/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = rootLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ DELETE /api/medecins/{medecinId} → Supprimer un médecin
    @DeleteMapping("/{medecinId}")
    public ResponseEntity<?> deleteMedecin(@PathVariable Long medecinId) {
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

    // ✅ Dashboard stats
    @GetMapping("/dashboard/stats")
    public Map<String, Object> getDashboardStats(@RequestParam Long userId) {
        Optional<Medecin> medecinOpt = medecinRepository.findByUserId(userId);
        if (medecinOpt.isEmpty()) {
            throw new RuntimeException("Médecin non trouvé");
        }
        Long medecinId = medecinOpt.get().getId();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientRepository.countByMedecinId(medecinId));
        LocalDate today = LocalDate.now();
        stats.put("rendezVousToday", rendezVousRepository.countByMedecinIdAndDate(medecinId, today));
        stats.put("dossiersMedicaux", consultationRepository.countByMedecinId(medecinId));
        stats.put("consultationsActives", consultationRepository.countByMedecinIdAndTraitementIsNull(medecinId));
        
        return stats;
    }

    // ✅ Chart data
    @GetMapping("/dashboard/chart-data")
    public List<Map<String, Object>> getChartData(@RequestParam Long userId) {
        Optional<Medecin> medecinOpt = medecinRepository.findByUserId(userId);
        if (medecinOpt.isEmpty()) {
            throw new RuntimeException("Médecin non trouvé");
        }
        Long medecinId = medecinOpt.get().getId();

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

    // ✅ Rendez-vous par médecin
    @GetMapping("/medecin/rendezvous/{userId}")
    public ResponseEntity<List<RendezVous>> getRendezVousByUserId(@PathVariable Long userId) {
        Optional<Medecin> medecinOpt = medecinRepository.findByUserId(userId);
        if (medecinOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Long medecinId = medecinOpt.get().getId();
        List<RendezVous> rendezVousList = rendezVousRepository.findByMedecinId(medecinId);
        return ResponseEntity.ok(rendezVousList);
    }
}