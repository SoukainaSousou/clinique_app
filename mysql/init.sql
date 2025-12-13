-- Création simple de la base de données
CREATE DATABASE IF NOT EXISTS clinique_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE clinique_db;

-- NOTE: Les tables seront créées automatiquement par JPA
-- avec spring.jpa.hibernate.ddl-auto=update


-- Création d'un utilisateur admin par défaut
INSERT INTO users (nom, prenom, email, mot_de_passe, role)
VALUES (
    'Admin',
    'System',
    'admin@clinique.com',
    'admin123',
    'admin'
);
