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
     cin: '',           // ← Ajouté
  mot_de_passe: ''   // ← Ajouté
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

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

  // Fonction pour récupérer les créneaux occupés
  const fetchOccupiedSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    
    try {
      setLoadingSlots(true);
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(`http://localhost:8080/rendezvous/occupied-slots/${doctorId}/${formattedDate}`);
      if (response.ok) {
        const slots = await response.json();
        setOccupiedSlots(slots);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des créneaux occupés:", error);
      setOccupiedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Fonction pour vérifier si un créneau est disponible
  const isSlotAvailable = (slot) => {
    return !occupiedSlots.includes(slot);
  };

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

  // Charger les créneaux occupés quand la date ou le médecin change
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchOccupiedSlots(selectedDoctor.id, selectedDate);
    }
  }, [selectedDate, selectedDoctor]);

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
  setPatientForm({ 
    nom:'', 
    prenom:'', 
    email:'', 
    telephone:'', 
    cin:'',           // ← Ajouté
    mot_de_passe:''   // ← Ajouté
  });
  setSelectedDate(new Date());
  setSelectedSlot('');
  setOccupiedSlots([]);
};

  const confirmAppointment = async () => {
  try {
    console.log("🔍 Recherche du patient avec email:", patientForm.email);
    
    // 1. Chercher le patient par email
    let patient = await getPatientByEmail(patientForm.email);
    console.log("📋 Patient trouvé:", patient);
    
    // 2. Si pas trouvé, créer le patient avec TOUS les champs
    if (!patient) {
      console.log("➕ Création d'un nouveau patient");
      patient = await createPatient(patientForm); // Envoie tous les champs
      console.log("✅ Patient créé avec ID:", patient.id);
    }

    // 3. Préparer les données pour le rendez-vous
    const appointmentData = {
      date: selectedDate.toISOString().split('T')[0],
      slot: selectedSlot,
      patientId: patient.id,
      doctorId: selectedDoctor.id
    };

    console.log("📅 Données du rendez-vous envoyées:", appointmentData);

    // 4. Créer le rendez-vous
    await createAppointment(appointmentData);

    alert("✅ Rendez-vous confirmé avec succès !");
    handleCloseModal();
  } catch (error) {
    console.error("❌ Erreur détaillée:", error);
    
    if (error.response) {
      console.error("📡 Status:", error.response.status);
      console.error("📡 Données d'erreur:", error.response.data);
      
      // Vérification spécifique pour l'erreur de CIN dupliqué
      const errorMessage = error.response.data?.message || '';
      const errorDetails = JSON.stringify(error.response.data).toLowerCase();
      
      if (errorMessage.includes('CIN') || errorDetails.includes('cin') || 
          errorMessage.includes('duplicate') || errorDetails.includes('unique') ||
          errorMessage.includes('déjà') || errorDetails.includes('existe')) {
        alert("❌ Erreur : Ce numéro CIN est déjà utilisé par un autre patient. Veuillez utiliser un CIN différent ou vous connecter avec votre compte existant.");
      } else if (error.response.status === 500) {
        alert("❌ Erreur serveur : Le numéro CIN existe peut-être déjà dans notre système. Veuillez vérifier vos informations ou contacter le support.");
      } else {
        alert("❌ Erreur lors de la confirmation du rendez-vous: " + (errorMessage || 'Veuillez réessayer.'));
      }
    } else {
      alert("Erreur de connexion. Veuillez vérifier votre internet et réessayer.");
    }
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
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      
      // Validation avancée
      const errors = [];
      
      if (!patientForm.nom.trim()) errors.push('Le nom est obligatoire');
      if (!patientForm.prenom.trim()) errors.push('Le prénom est obligatoire');
      if (!patientForm.email.trim()) errors.push('L\'email est obligatoire');
      if (!patientForm.telephone.trim()) errors.push('Le téléphone est obligatoire');
      if (!patientForm.cin.trim()) errors.push('Le CIN est obligatoire');
      if (!patientForm.mot_de_passe.trim()) {
        errors.push('Le mot de passe est obligatoire');
      } else if (patientForm.mot_de_passe.length < 6) {
        errors.push('Le mot de passe doit contenir au moins 6 caractères');
      }
      
      if (errors.length > 0) {
        alert('Veuillez corriger les erreurs suivantes :\n' + errors.join('\n'));
        return;
      }
      
      setStep(2); 
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <label>Nom :
          <input 
            type="text" 
            value={patientForm.nom} 
            onChange={(e) => setPatientForm({ ...patientForm, nom: e.target.value })} 
            required 
          />
        </label>
        <label>Prénom :
          <input 
            type="text" 
            value={patientForm.prenom} 
            onChange={(e) => setPatientForm({ ...patientForm, prenom: e.target.value })} 
            required 
          />
        </label>
      </div>
      
      <label>Email :
        <input 
          type="email" 
          value={patientForm.email} 
          onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })} 
          required 
        />
      </label>
      
      <label>Téléphone :
        <input 
          type="tel" 
          value={patientForm.telephone} 
          onChange={(e) => setPatientForm({ ...patientForm, telephone: e.target.value })} 
          required 
        />
      </label>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <label>CIN :
          <input 
            type="text" 
            value={patientForm.cin} 
            onChange={(e) => setPatientForm({ ...patientForm, cin: e.target.value })}
            required
          />
        </label>
        <label>Mot de passe :
          <input 
            type="password" 
            value={patientForm.mot_de_passe} 
            onChange={(e) => setPatientForm({ ...patientForm, mot_de_passe: e.target.value })}
            required
            minLength="6"
          />
        </label>
      </div>
      
      <div style={{ 
        color: '#6b7280', 
        fontSize: '0.75rem', 
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        Tous les champs sont obligatoires. Mot de passe minimum 6 caractères.
      </div>

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

                  {loadingSlots && (
                    <div style={{ textAlign: 'center', color: '#666', margin: '10px 0' }}>
                      Chargement des disponibilités...
                    </div>
                  )}

                  <div className={styles.slotsGrid}>
                    {getSlotsForDate(selectedDate).map(slot => {
                      const isOccupied = !isSlotAvailable(slot);
                      const isSelected = selectedSlot === slot;
                      
                      return (
                        <button 
                          key={slot} 
                          type="button"
                          className={`${styles.slotButton} ${
                            isSelected ? styles.slotButtonSelected : ''
                          } ${
                            isOccupied ? styles.slotButtonOccupied : ''
                          }`}
                          onClick={() => {
                            if (!isOccupied) {
                              setSelectedSlot(slot);
                            }
                          }}
                          disabled={isOccupied}
                        >
                          {slot}
                          {isOccupied && <span style={{
                            fontSize: '0.7em',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            marginLeft: '5px'
                          }}>Occupé</span>}
                        </button>
                      );
                    })}
                  </div>

                  {occupiedSlots.length > 0 && (
                    <div style={{
                      textAlign: 'center',
                      color: '#856404',
                      backgroundColor: '#fff3cd',
                      padding: '8px',
                      borderRadius: '4px',
                      margin: '10px 0',
                      fontSize: '0.9em'
                    }}>
                      {occupiedSlots.length} créneau(x) déjà réservé(s) pour cette date
                    </div>
                  )}

                  <div className={styles.stepActions}>
                    <button type="button" onClick={()=>setStep(1)}>⬅ Retour</button>
                    <button type="button" onClick={()=>{ 
                      if(!selectedSlot){
                        alert('Veuillez choisir un créneau');
                        return;
                      } 
                      setStep(3); 
                    }}>Continuer</button>
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
                <p><strong>Téléphone :</strong> {patientForm.telephone}</p>
  {patientForm.cin && <p><strong>CIN :</strong> {patientForm.cin}</p>}
  {patientForm.mot_de_passe && <p><strong>Mot de passe :</strong> ••••••••</p>}
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