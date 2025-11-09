package com.example.clinique.services;

import com.example.clinique.dto.LoginRequest;
import com.example.clinique.dto.LoginResponse;
import com.example.clinique.entities.User;
import com.example.clinique.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse authenticate(LoginRequest loginRequest) {
        System.out.println("🔐 Tentative de connexion pour: " + loginRequest.getEmail());
        
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOptional.isEmpty()) {
            System.out.println("❌ Email non trouvé: " + loginRequest.getEmail());
            return new LoginResponse(false, "Email non trouvé");
        }

        User user = userOptional.get();
        System.out.println("✅ Utilisateur trouvé: " + user.getEmail() + " - Role: " + user.getRole());

        // Vérification du mot de passe
        if (!user.getMot_de_passe().equals(loginRequest.getPassword())) {
            System.out.println("❌ Mot de passe incorrect pour: " + loginRequest.getEmail());
            return new LoginResponse(false, "Mot de passe incorrect");
        }

        // Génération du token
        String token = generateToken(user);
        
        // Détermination de l'URL de redirection selon le rôle
        String redirectUrl = determineRedirectUrl(user.getRole());
        
        System.out.println("✅ Connexion réussie - Redirection vers: " + redirectUrl);

        return new LoginResponse(true, "Connexion réussie", token, user, redirectUrl);
    }

    private String generateToken(User user) {
        return "token-" + user.getId() + "-" + System.currentTimeMillis();
    }

    private String determineRedirectUrl(User.Role role) {
        switch (role) {
            case admin:
                return "/admin/dashboard";
            case medecin:
                return "/medecin/dashboard";
            case secretaire:
                return "/secretaire/dashboard";
            default:
                return "/";
        }
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}