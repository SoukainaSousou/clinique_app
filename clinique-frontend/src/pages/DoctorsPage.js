import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Calendar, Search, Filter } from 'lucide-react';
import styles from '../components/CliniqueInfo.module.css';
import Navbar from '../components/layout/Navbar';
import { getDoctors } from '../services/medecinService';

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await getDoctors();
      setDoctors(data);
    };
    fetchDoctors();
  }, []);

  const specialties = ["Toutes", "Cardiologie", "Pédiatrie", "Dentisterie", "Ophtalmologie", "Neurologie"];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialite?.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === "Toutes" || 
                           doctor.specialite?.nom === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className={styles.doctorsPage}>
      <Navbar />

      {/* Header */}
      <header className={styles.pageHeader}>
        <div className={styles.pageNav}>
          <Link to="/" className={styles.backButton}>← Retour à l'accueil</Link>
          <h1>Notre Équipe Médicale</h1>
        </div>
      </header>

      {/* Recherche et filtre */}
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
              <option key={specialty} value={specialty}>{specialty}</option>
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
            <div className={styles.doctorImage}>👨‍⚕️</div>
            <div className={styles.doctorInfo}>
              <h3 className={styles.doctorName}>Dr.{doctor.nom} {doctor.prenom}</h3>
             <p className={styles.doctorSpecialty}>{doctor.specialite || "Aucune spécialité"}</p>

              <div className={styles.doctorActions}>
                <Link to={`/medecins/${doctor.id}`} className={styles.detailButton}>Voir le profil</Link>
                <button className={styles.detailButton}>
                  <Calendar size={14} /> Prendre RDV
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className={styles.noResults}>
          <p>Aucun médecin trouvé.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
