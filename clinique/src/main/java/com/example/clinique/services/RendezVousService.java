package com.example.clinique.services;

import com.example.clinique.dto.RendezVousRequest;
import com.example.clinique.dto.CreateRendezVousDTO;
import com.example.clinique.entities.Medecin;
import com.example.clinique.entities.Patient;
import com.example.clinique.entities.RendezVous;
import com.example.clinique.repository.MedecinRepository;
import com.example.clinique.repository.PatientRepository;
import com.example.clinique.repository.RendezVousRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RendezVousService {

    @Autowired
    private RendezVousRepository rendezVousRepo;

    @Autowired
    private MedecinRepository medecinRepo;

    @Autowired
    private PatientRepository patientRepo;

    // NOUVELLE méthode pour utiliser l'ID patient existant
    public RendezVous createRendezVousWithPatientId(CreateRendezVousDTO req) {
        System.out.println("📥 Création RDV avec patientId: " + req);

        // Validations
        if (req.getDoctorId() == null) {
            throw new IllegalArgumentException("L'identifiant du médecin est requis.");
        }
        if (req.getPatientId() == null) {
            throw new IllegalArgumentException("L'identifiant du patient est requis.");
        }
        if (req.getDate() == null || req.getDate().isEmpty()) {
            throw new IllegalArgumentException("La date du rendez-vous est requise.");
        }
        if (req.getSlot() == null || req.getSlot().isEmpty()) {
            throw new IllegalArgumentException("Le créneau horaire est requis.");
        }

        // Récupérer le médecin
        Medecin medecin = medecinRepo.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Médecin introuvable avec ID: " + req.getDoctorId()));

        // Récupérer le patient par ID (EXISTANT)
        Patient patient = patientRepo.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient introuvable avec ID: " + req.getPatientId()));

        System.out.println("✅ Patient trouvé: " + patient.getNom() + " " + patient.getPrenom());

        // Parser la date
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(req.getDate(), formatter);

        // Créer le rendez-vous
        RendezVous rdv = new RendezVous();
        rdv.setPatient(patient);
        rdv.setMedecin(medecin);
        rdv.setDate(date);
        rdv.setSlot(req.getSlot());

        System.out.println("✅ Création RDV réussie: medecinId=" + medecin.getId() +
                       ", patientId=" + patient.getId() +
                       ", date=" + date +
                       ", slot=" + req.getSlot());

        return rendezVousRepo.save(rdv);
    }

    // Ancienne méthode pour création avec infos patient complètes
    public RendezVous createRendezVous(RendezVousRequest req) {
        System.out.println("📥 Création RDV avec infos patient: " + req);

        // Validations
        if (req.getDoctorId() == null) {
            throw new IllegalArgumentException("L'identifiant du médecin est requis.");
        }

        // Récupérer le médecin
        Medecin medecin = medecinRepo.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Médecin introuvable"));

        // Vérifier si patient existe déjà par email
        Patient patient = null;
        if (req.getEmail() != null && !req.getEmail().isEmpty()) {
            Optional<Patient> existingPatient = patientRepo.findByEmail(req.getEmail());
            if (existingPatient.isPresent()) {
                patient = existingPatient.get();
                System.out.println("✅ Patient existant trouvé par email: " + patient.getEmail());
            }
        }

        // Si le patient n'existe pas, on le crée
        if (patient == null) {
            patient = new Patient();
            patient.setNom(req.getNom() != null ? req.getNom() : "Inconnu");
            patient.setPrenom(req.getPrenom() != null ? req.getPrenom() : "Inconnu");
            patient.setEmail(req.getEmail() != null ? req.getEmail() : "");
            patient.setTel(req.getTelephone() != null ? req.getTelephone() : "");
            patient.setAdresse(req.getAdresse() != null ? req.getAdresse() : "");
            patient.setCin(req.getCin() != null ? req.getCin() : "");
            patient.setMotDePasse(req.getMotDePasse() != null ? req.getMotDePasse() : "");

            patient = patientRepo.save(patient);
            System.out.println("✅ Nouveau patient créé: " + patient.getNom() + " " + patient.getPrenom());
        }

        // Validations date et créneau
        if (req.getDate() == null || req.getDate().isEmpty()) {
            throw new IllegalArgumentException("La date du rendez-vous est requise.");
        }
        if (req.getSlot() == null || req.getSlot().isEmpty()) {
            throw new IllegalArgumentException("Le créneau horaire est requis.");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(req.getDate(), formatter);

        // Créer le rendez-vous
        RendezVous rdv = new RendezVous();
        rdv.setPatient(patient);
        rdv.setMedecin(medecin);
        rdv.setDate(date);
        rdv.setSlot(req.getSlot());

        System.out.println("✅ Création RDV réussie: medecinId=" + medecin.getId() +
                       ", patientId=" + patient.getId() +
                       ", date=" + date +
                       ", slot=" + req.getSlot());

        return rendezVousRepo.save(rdv);
    }

    // Méthode pour récupérer les créneaux occupés
    public List<String> getOccupiedSlots(Integer medecinId, LocalDate date) {
        List<RendezVous> rendezVousList = rendezVousRepo.findByMedecinIdAndDate(medecinId, date);
        return rendezVousList.stream()
                .map(RendezVous::getSlot)
                .collect(Collectors.toList());
    }

    // NOUVELLE MÉTHODE : Récupérer les rendez-vous d'un patient
    public List<RendezVous> getRendezVousByPatientId(Integer patientId) {
        System.out.println("🔍 Recherche des rendez-vous pour patient ID: " + patientId);
        
        // Vérifier si le patient existe
        Optional<Patient> patient = patientRepo.findById(patientId);
        if (patient.isEmpty()) {
            System.out.println("❌ Patient non trouvé avec ID: " + patientId);
            return List.of(); // Retourne une liste vide si patient non trouvé
        }

        List<RendezVous> rendezVousList = rendezVousRepo.findByPatientId(patientId);
        System.out.println("✅ " + rendezVousList.size() + " rendez-vous trouvés pour patient ID: " + patientId);
        
        return rendezVousList;
    }
}