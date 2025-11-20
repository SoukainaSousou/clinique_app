import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { getDoctors } from '../services/medecinService';
import styles from '../components/CliniqueInfo.module.css';

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

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialite?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === "Toutes" ||
      d.specialite?.title === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className={styles.doctorsPage}>
      <Navbar />

      <header className={styles.pageHeader}>
        <div className={styles.pageNav}>
          <Link to="/" className={styles.backButton}>← Retour à l'accueil</Link>
          <h1>Notre Équipe Médicale</h1>
        </div>
      </header>

      {/* Recherche & filtre */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher un médecin ou spécialité..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.specialtyFilter}>
          <Filter size={16} />
          <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)}>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Liste des médecins */}
      <div className={styles.doctorsGrid}>
        {filteredDoctors.map((doc, index) => (
          <motion.div key={doc.id} className={styles.doctorCard} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <div className={styles.doctorImage}>
              {doc.image ? (
                <img src={doc.image} />
              ) : (
                <span>{doc.specialite?.iconName || "👨‍⚕️"}</span>
              )}
            </div>

            <div className={styles.doctorInfo}>
              <h3>{doc.nom} {doc.prenom}</h3>
              <p>Spécialité: {doc.specialite?.title || "Non spécifiée"}</p>
              <p>Diplômes: {doc.specialite?.description}</p>
              <p>Actes et soins: {doc.specialite?.details}</p>
              <p>Expériences: {doc.experiences}</p>
              <p>Langues: {doc.languages?.join(", ")}</p>

              <div className={styles.doctorActions}>
                <Link to={`/medecins/${doc.id}`} className={styles.detailButton}>Voir le profil</Link>
                <button className={styles.detailButton}><Calendar size={14} /> Prendre RDV</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
