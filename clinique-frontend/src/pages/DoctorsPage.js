import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Calendar, Search, Filter } from 'lucide-react';
import styles from '../components/CliniqueInfo.module.css';
import Navbar from '../components/layout/Navbar';

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const doctors = [
    { 
      id: 1, 
      name: "Dr. Ahmed Khan", 
      specialty: "Cardiologie", 
      experience: "15 ans", 
      image: "👨‍⚕️",
      rating: 4.9,
      patients: 2500,
      languages: ["Français", "Arabe", "Anglais"]
    },
    { 
      id: 2, 
      name: "Dr. Sophie Martin", 
      specialty: "Pédiatrie", 
      experience: "12 ans", 
      image: "👩‍⚕️",
      rating: 4.8,
      patients: 1800,
      languages: ["Français", "Anglais"]
    },
    { 
      id: 3, 
      name: "Dr. Pierre Dubois", 
      specialty: "Dentisterie", 
      experience: "10 ans", 
      image: "👨‍⚕️",
      rating: 4.7,
      patients: 2200,
      languages: ["Français", "Arabe"]
    },
    { 
      id: 4, 
      name: "Dr. Fatima Alami", 
      specialty: "Ophtalmologie", 
      experience: "8 ans", 
      image: "👩‍⚕️",
      rating: 4.9,
      patients: 1900,
      languages: ["Français", "Arabe", "Espagnol"]
    }
  ];

  const specialties = ["Toutes", "Cardiologie", "Pédiatrie", "Dentisterie", "Ophtalmologie", "Neurologie"];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === "Toutes" || 
                           doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className={styles.doctorsPage}>
      <Navbar />
      {/* Header */}
      <header className={styles.pageHeader}>
        <div className={styles.pageNav}>
          <Link to="/" className={styles.backButton}>
            ← Retour à l'accueil
          </Link>
          <h1>Notre Équipe Médicale</h1>
        </div>
      </header>

      {/* Filtres et recherche */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher un médecin ou une spécialité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.specialtyFilter}>
          <Filter size={16} />
          <select 
            value={selectedSpecialty} 
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des médecins */}
      <div className={styles.doctorsGrid}>
        {filteredDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            className={styles.doctorCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.doctorImage}>
              {doctor.image}
            </div>
            
            <div className={styles.doctorInfo}>
              <h3 className={styles.doctorName}>{doctor.name}</h3>
              <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
              <p className={styles.doctorExperience}>{doctor.experience} d'expérience</p>
              
              <div className={styles.doctorRating}>
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span>{doctor.rating}/5</span>
                <span className={styles.patientsCount}>({doctor.patients} patients)</span>
              </div>

              <div className={styles.languages}>
                {doctor.languages.map(lang => (
                  <span key={lang} className={styles.languageTag}>{lang}</span>
                ))}
              </div>

              <div className={styles.doctorActions}>
                <Link 
                  to={`/medecins/${doctor.id}`} 
                  className={styles.detailButton}
                >
                  Voir le profil
                </Link>
                <button className={styles.detailButton}>
                  <Calendar size={14} />
                  Prendre RDV
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className={styles.noResults}>
          <p>Aucun médecin trouvé pour votre recherche.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;