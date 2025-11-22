import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { getDoctors } from '../services/medecinService';
import styles from '../components/CliniqueInfo.module.css';

// ** BACKEND **
import { getPatientByEmail, createPatient } from '../services/patientService';
import { createAppointment } from '../services/rendezVousService';

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [step, setStep] = useState(0); // 0 = aucun, 1 = infos patient, 2 = date/creneau, 3 = confirmation

  const [patientForm, setPatientForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');

  const frenchDays = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
  const frenchMonths = [
    'Janvier','Février','Mars','Avril','Mai','Juin',
    'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
  ];

  const weekdaySlots = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '14:30','15:00','15:30','16:00','16:30','17:00',
  ];

  const saturdaySlots = ['09:00','09:30','10:00','10:30','11:00','11:30'];

  const getSlotsForDate = (date) => {
    const day = date.getDay();
    if (day === 0) return [];
    if (day === 6) return saturdaySlots;
    return weekdaySlots;
  };

  const getWeekDays = (baseDate) => {
    const days = [];
    const start = new Date();
    if (baseDate > start) start.setTime(baseDate.getTime());
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const goToPrevMonth = () => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() - 1);
    const now = new Date();
    if (d.getMonth() < now.getMonth() && d.getFullYear() <= now.getFullYear()) return;
    setSelectedDate(d);
    setSelectedSlot('');
  };

  const goToNextMonth = () => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + 1);
    setSelectedDate(d);
    setSelectedSlot('');
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des médecins :', error);
      }
    };
    fetchDoctors();
  }, []);

  const specialties = [
    'Toutes','Cardiologie','Pédiatrie','Dentisterie','Ophtalmologie','Neurologie',
  ];

  const filteredDoctors = doctors.filter((d) => {
    const nom = d.nom || '';
    const prenom = d.prenom || '';
    const specialiteTitle = d.specialite?.title || '';

    const matchesSearch =
      nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialiteTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      !selectedSpecialty ||
      selectedSpecialty === 'Toutes' ||
      specialiteTitle === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const doctorsBySpecialty = filteredDoctors.reduce((acc, doc) => {
    const specialtyName = doc.specialite?.title || 'Autres';
    if (!acc[specialtyName]) acc[specialtyName] = [];
    acc[specialtyName].push(doc);
    return acc;
  }, {});

  const handleTakeAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(1);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setStep(0);
    setPatientForm({ nom:'', prenom:'', email:'', telephone:'' });
    setSelectedDate(new Date());
    setSelectedSlot('');
  };

  const confirmAppointment = async () => {
  try {
    console.log("🔍 Recherche du patient avec email:", patientForm.email);
    
    // 1. Chercher le patient par email
    let patient = await getPatientByEmail(patientForm.email);
    console.log("📋 Patient trouvé:", patient);
    
    // 2. Si pas trouvé, créer le patient
    if (!patient) {
      console.log("➕ Création d'un nouveau patient");
      patient = await createPatient(patientForm);
      console.log("✅ Patient créé avec ID:", patient.id);
    }

    // 3. Préparer les données pour le NOUVEAU endpoint
    const appointmentData = {
      date: selectedDate.toISOString().split('T')[0],
      slot: selectedSlot,
      patientId: patient.id,  // Utiliser l'ID du patient existant
      doctorId: selectedDoctor.id
    };

    console.log("📅 Données du rendez-vous envoyées:", appointmentData);

    // 4. Créer le rendez-vous avec le NOUVEAU format
    await createAppointment(appointmentData);

    alert("Rendez-vous confirmé !");
    handleCloseModal();
  } catch (error) {
    console.error("❌ Erreur détaillée:", error);
    
    if (error.response) {
      console.error("📡 Status:", error.response.status);
      console.error("📡 Données d'erreur:", error.response.data);
    }
    
    alert("Erreur lors de la confirmation du rendez-vous.");
  }
};
  return (
    <div className={styles.doctorsPage}>
      <Navbar />
      <header className={styles.pageHeader}>
        <div className={styles.pageNav}>
          <Link to="/" className={styles.backButton}>
            ← Retour à l'accueil
          </Link>
          <h1>Notre Équipe Médicale</h1>
        </div>
      </header>

      {/* Recherche & filtre */}
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
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste médecins */}
      <div className={styles.doctorsGrid}>
        {Object.entries(doctorsBySpecialty).map(([specName, docs]) => (
          <div key={specName} className={styles.specialtySection}>
            <h2 className={styles.specialtyTitle}>{specName}</h2>
            <div className={styles.specialtyDoctorsRow}>
              {docs.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  className={styles.doctorCard}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.doctorImage}>
                    {doc.image ? (
                      <img src={doc.image} alt={`${doc.nom} ${doc.prenom}`} />
                    ) : (
                      <span>{doc.specialite?.iconName || '👨‍⚕️'}</span>
                    )}
                  </div>
                  <div className={styles.doctorInfo}>
                    <h3>{doc.nom} {doc.prenom}</h3>
                    <p>Spécialité : {doc.specialite?.title || 'Non spécifiée'}</p>
                    <div className={styles.doctorActions}>
                      <Link to={`/medecins/${doc.id}`} className={styles.detailButton}>
                        Voir le profil
                      </Link>
                      <button
                        className={styles.detailButton}
                        onClick={() => handleTakeAppointment(doc)}
                      >
                        <Calendar size={14} /> Prendre RDV
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal prise de rendez-vous */}
      {selectedDoctor && step > 0 && (
        <div className={styles.appointmentOverlay}>
          <div className={styles.appointmentModal}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              ✕
            </button>

            <div className={styles.doctorHeaderCard}>
              <div className={styles.doctorHeaderAvatar}>
                {selectedDoctor.image ? (
                  <img
                    src={selectedDoctor.image}
                    alt={`${selectedDoctor.nom} ${selectedDoctor.prenom}`}
                  />
                ) : (
                  <span>{selectedDoctor.specialite?.iconName || '👨‍⚕️'}</span>
                )}
              </div>
              <div className={styles.doctorHeaderInfo}>
                <h3>Dr {selectedDoctor.nom} {selectedDoctor.prenom}</h3>
                <p className={styles.headerSpecialty}>{selectedDoctor.specialite?.title}</p>
                <p className={styles.headerLocation}><MapPin size={14} /> Oujda Principal Oujda</p>
              </div>
            </div>

            <h2>Prendre rendez-vous</h2>

            {/* Étape 1 */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <h3>Vos informations</h3>
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <label>Nom :
                    <input type="text" value={patientForm.nom} onChange={(e) =>
                      setPatientForm({ ...patientForm, nom: e.target.value })} required />
                  </label>
                  <label>Prénom :
                    <input type="text" value={patientForm.prenom} onChange={(e) =>
                      setPatientForm({ ...patientForm, prenom: e.target.value })} required />
                  </label>
                  <label>Email :
                    <input type="email" value={patientForm.email} onChange={(e) =>
                      setPatientForm({ ...patientForm, email: e.target.value })} required />
                  </label>
                  <label>Téléphone :
                    <input type="tel" value={patientForm.telephone} onChange={(e) =>
                      setPatientForm({ ...patientForm, telephone: e.target.value })} required />
                  </label>
                  <div className={styles.stepActions}>
                    <button type="button" onClick={handleCloseModal}>Annuler</button>
                    <button type="submit">Continuer</button>
                  </div>
                </form>
              </div>
            )}

            {/* Étape 2 */}
            {step === 2 && (
              <div className={styles.stepContent}>
                {/* Date & créneau */}
                <div className={styles.appointmentBody}>
                  <div className={styles.calendarHeader}>
                    <button type="button" onClick={goToPrevMonth}><ChevronLeft size={18} /></button>
                    <span>{frenchMonths[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
                    <button type="button" onClick={goToNextMonth}><ChevronRight size={18} /></button>
                  </div>

                  <div className={styles.daysRow}>
                    {getWeekDays(selectedDate).map((d) => {
                      const isSelected = d.toDateString() === selectedDate.toDateString();
                      const isSunday = d.getDay() === 0;
                      const isPast = d < new Date(new Date().setHours(0,0,0,0));
                      return (
                        <button key={d.toISOString()} type="button"
                          className={`${styles.dayCard} ${isSelected ? styles.dayCardSelected : ''} ${isSunday || isPast ? styles.dayCardDisabled : ''}`}
                          onClick={() => { if(!isSunday && !isPast){ setSelectedDate(d); setSelectedSlot(''); } }}
                          disabled={isSunday || isPast}>
                          <span className={styles.dayName}>{frenchDays[d.getDay()]}</span>
                          <span className={styles.dayNumber}>{d.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.slotsGrid}>
                    {getSlotsForDate(selectedDate).map(slot => (
                      <button key={slot} type="button"
                        className={`${styles.slotButton} ${selectedSlot===slot ? styles.slotButtonSelected : ''}`}
                        onClick={()=>setSelectedSlot(slot)}>
                        {slot}
                      </button>
                    ))}
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" onClick={()=>setStep(1)}>⬅ Retour</button>
                    <button type="button" onClick={()=>{ if(!selectedSlot){alert('Veuillez choisir un créneau');return;} setStep(3); }}>Continuer</button>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3 */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <h3>Confirmation du rendez-vous</h3>
                <p><strong>Docteur :</strong> {selectedDoctor.nom} {selectedDoctor.prenom}</p>
                <p><strong>Spécialité :</strong> {selectedDoctor.specialite?.title}</p>
                <p><strong>Patient :</strong> {patientForm.prenom} {patientForm.nom}</p>
                <p><strong>Email :</strong> {patientForm.email}</p>
                <p><strong>Téléphone :</strong> {patientForm.telephone}</p>
                <p><strong>Date :</strong> {selectedDate.toLocaleDateString('fr-FR')}</p>
                <p><strong>Créneau :</strong> {selectedSlot}</p>

                <div className={styles.stepActions}>
                  <button type="button" onClick={()=>setStep(2)}>⬅ Modifier</button>
                  <button type="button" onClick={confirmAppointment}>
                    Confirmer le rendez-vous
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
