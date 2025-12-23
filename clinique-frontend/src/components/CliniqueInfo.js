import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './layout/Navbar';
import {
  Stethoscope, Users, ClipboardList, Phone,
  Calendar, Clock, MapPin, ArrowRight,
  Heart, Eye, Brain, Star, ChevronDown,
  ChevronLeft, ChevronRight,
  Baby, Microscope
} from 'lucide-react';

import { Link } from 'react-router-dom';
import styles from './CliniqueInfo.module.css';
import { getDoctors } from '../services/medecinService';

// ** BACKEND **
import { getPatientByEmail, createPatient } from '../services/patientService';
import { createAppointment } from '../services/rendezVousService';

// Icônes personnalisées - DÉPLACÉ EN DEHORS DU COMPOSANT
const CustomIcons = {
  Pediatrie: () => <span style={{ fontSize: '24px' }}>👶</span>,
  Dentisterie: () => <span style={{ fontSize: '24px' }}>🦷</span>,
  Analyses: () => <span style={{ fontSize: '24px' }}>🔬</span>
};

const iconMap = {
  heart: <Heart size={32} />,
  skin: <Eye size={32} />,
  child: <Baby size={32} />,
  brain: <Brain size={32} />,
  microscope: <Microscope size={32} />,
  default: <Stethoscope size={32} />,
};


export default function CliniqueInfo() {
  // TOUS LES USESTATE DOIVENT ÊTRE À L'INTÉRIEUR DU COMPOSANT
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // États pour la modal de rendez-vous
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [step, setStep] = useState(0); // 0 = aucun, 1 = infos patient, 2 = date/creneau, 3 = confirmation
  const [patientForm, setPatientForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    cin: '',
    mot_de_passe: ''
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // NOUVEAUX ÉTATS POUR LA MODAL DE DÉTAILS DES SERVICES
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);

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

  // Fonctions pour la modal de rendez-vous
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
      cin:'',
      mot_de_passe:''
    });
    setSelectedDate(new Date());
    setSelectedSlot('');
    setOccupiedSlots([]);
  };

  // NOUVELLE FONCTION POUR LES DÉTAILS DES SERVICES
  // CORRECTION DE LA FONCTION handleShowServiceDetails
const handleShowServiceDetails = async (service) => {
  console.log("🟢 handleShowServiceDetails appelé avec:", service);
  
  setSelectedService(service);
  
  try {
    // Récupérer tous les médecins
    const allDoctors = await getDoctors();
    console.log("📋 Tous les médecins:", allDoctors);
    
    // Filtrer les médecins par spécialité - CORRECTION ICI
    const specialtyDoctors = allDoctors.filter(doctor => {
      // Vérifier si le médecin a une spécialité
      if (!doctor.specialite) return false;
      
      // Essayer plusieurs méthodes de correspondance
      const doctorSpecialtyTitle = doctor.specialite.title || doctor.specialite;
      const serviceTitle = service.title;
      
      console.log(`🔍 Comparaison: "${doctorSpecialtyTitle}" === "${serviceTitle}"`);
      
      // Retourner true si les titres correspondent
      return doctorSpecialtyTitle === serviceTitle;
    });
    
    console.log("👨‍⚕️ Médecins filtrés pour", service.title, ":", specialtyDoctors);
    
    setSelectedService({
      ...service,
      doctors: specialtyDoctors
    });
  } catch (error) {
    console.error("❌ Erreur lors du chargement des médecins:", error);
    setSelectedService({
      ...service,
      doctors: []
    });
  }
  
  setShowServiceDetails(true);
};
  const handleCloseServiceDetails = () => {
    setSelectedService(null);
    setShowServiceDetails(false);
  };

  const confirmAppointment = async () => {
    try {
      console.log("🔍 Recherche du patient avec email:", patientForm.email);
      
      let patient = await getPatientByEmail(patientForm.email);
      console.log("📋 Patient trouvé:", patient);
      
      if (!patient) {
        console.log("➕ Création d'un nouveau patient");
        patient = await createPatient(patientForm);
        console.log("✅ Patient créé avec ID:", patient.id);
      }

      const appointmentData = {
        date: selectedDate.toISOString().split('T')[0],
        slot: selectedSlot,
        patientId: patient.id,
        doctorId: selectedDoctor.id
      };

      console.log("📅 Données du rendez-vous envoyées:", appointmentData);
      await createAppointment(appointmentData);

      alert("Rendez-vous confirmé !");
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

  // Charger les services depuis l'API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/specialities');
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // Charger les médecins depuis l'API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Erreur lors du chargement des médecins:', error);
      } finally {
        setLoadingDoctors(false);
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

  const stats = [
    { number: "50+", label: "Médecins experts" },
    { number: "10k+", label: "Patients satisfaits" },
    { number: "24/7", label: "Urgences" },
    { number: "15", label: "Spécialités" }
  ];

  return (
    <div className={styles.container}>
      <Navbar />

      {/* ---- Hero Section avec CTA ---- */}
      <section id="accueil" className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={styles.heroContent}
        >
          <div className={styles.heroBadge}>🏆 Meilleure clinique 2024</div>

          <h1 className={styles.heroTitle}>
            Votre Santé,
            <span className={styles.highlight}> Notre Priorité</span>
          </h1>

          <p className={styles.heroText}>
            Des soins médicaux d'excellence dans un environnement moderne et chaleureux.
            Notre équipe de professionnels dévoués est à votre service 24h/24.
          </p>

         <div className={styles.heroButtons}>
  <Link to="/medecins" className={styles.primaryButton}>
    Prendre Rendez-vous <ArrowRight size={16} />
  </Link>
  <Link to="/urgences" className={styles.secondaryButton}>
    Urgence <Phone size={16} />
  </Link>
</div>
          <div className={styles.heroStats}>
  {stats.map((stat, index) => (
    <motion.div
      key={stat.label}
      className={styles.statItem}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.1 }}
    >
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#ffffff', /* Blanc pur */
        marginBottom: '0.5rem',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
      }}>
        {stat.number}
      </div>
      <div style={{
        fontSize: '0.9rem',
        color: '#fbbf24', /* Jaune doré */
        fontWeight: '500',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
      }}>
        {stat.label}
      </div>
    </motion.div>
  ))}
</div>
        </motion.div>

        <motion.div
          className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ---- Section Services ---- */}
      <section id="services" className={styles.services}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nos Services Médicaux</h2>
          <p className={styles.sectionSubtitle}>
            Des soins complets pour toute la famille
          </p>
        </div>

        {loadingServices ? (
          <div className={styles.servicesGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.serviceCard} style={{ opacity: 0.6 }}>
                <div className={styles.serviceIcon}>⏳</div>
                <div className={styles.serviceTitle}>Chargement...</div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <motion.div
                key={service.id}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className={styles.serviceIcon}>
                 {iconMap[service.iconName?.toLowerCase()] || iconMap.default}
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <button 
                  className={styles.serviceButton}
                  onClick={() => handleShowServiceDetails(service)}
                >
                  En savoir plus <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ---- Section Médecins ---- */}
      <section id="doctors" className={styles.doctors}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Notre Équipe Médicale</h2>
          <p className={styles.sectionSubtitle}>
            Des professionnels expérimentés à votre service
          </p>
        </div>

        {loadingDoctors ? (
          <p style={{ textAlign: 'center' }}>Chargement des médecins...</p>
        ) : (
          <div className={styles.doctorsGrid}>
            {doctors.map((doc, index) => (
              <motion.div
                key={doc.id}
                className={styles.doctorCard}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
               <div className={styles.doctorImage}>
  {doc.image ? (
    <img src={doc.image} alt={`Dr ${doc.nom} ${doc.prenom}`} />
  ) : (
    <span style={{ fontSize: '24px' }}>👨‍⚕️</span>
  )}
</div>

                <div className={styles.doctorInfo}>
                  <h3>Dr {doc.nom || ''} {doc.prenom || ''}</h3>
                 <p>
  Spécialité :{" "}
  <span className={styles.doctorSpecialty}>
    {doc.specialite?.title || "Non spécifiée"}
  </span>
</p>

                  <p>Expériences : {doc.experiences || "Expérience confirmée"}</p>
                  <p>Langues : {doc.languages?.join(", ") || "Français"}</p>

                  <div className={styles.doctorRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>

                  <div className={styles.doctorActions}>
                    <Link to={`/medecins/${doc.id}`} className={styles.doctorButton}>
  Voir Profil <ArrowRight size={14} />
</Link>

                    <button 
                      className={styles.doctorButton}
                      onClick={() => handleTakeAppointment(doc)}
                    >
                      Prendre RDV <Calendar size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ---- Section Urgences ---- */}
      <section id="urgence" className={styles.emergency}>
        <div className={styles.emergencyContent}>
          <motion.div
            className={styles.emergencyText}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className={styles.emergencyTitle}>
              Service d'Urgence 24h/24
            </h2>
            <p className={styles.emergencyDescription}>
              Notre service d'urgence est disponible jour et nuit pour prendre
              en charge toutes les situations médicales critiques.
            </p>
            <div className={styles.emergencyInfo}>
              <div className={styles.emergencyItem}>
                <Clock size={20} />
                <span>Ouvert 24h/24, 7j/7</span>
              </div>
              <div className={styles.emergencyItem}>
                <Phone size={20} />
                <span>0536-50-06-01</span>
              </div>
              <div className={styles.emergencyItem}>
                <MapPin size={20} />
                <span>12 Rue de la Santé, Oujda</span>
              </div>
            </div>
            <button className={styles.emergencyButton}>
              Appeler Urgence <Phone size={16} />
            </button>
          </motion.div>

          <motion.div
            className={styles.emergencyVisual}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className={styles.emergencyBadge}>🚨 URGENCE</div>
          </motion.div>
        </div>
      </section>

      {/* ---- Section Contact ---- */}
      <section id="contact" className={styles.contact}>
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h2 className={styles.contactTitle}>Prendre Contact</h2>
            <p className={styles.contactDescription}>
              N'hésitez pas à nous contacter pour toute question ou prise de rendez-vous.
            </p>

            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <Phone size={24} />
                <div>
                  <h4>Téléphone</h4>
                  <p>0536-50-06-01</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <MapPin size={24} />
                <div>
                  <h4>Adresse</h4>
                  <p>12 Rue de la Santé, Oujda</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <Clock size={24} />
                <div>
                  <h4>Horaires</h4>
                  <p>Lun - Ven: 8h-20h<br />Sam: 8h-14h</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <h3>Formulaire de Contact</h3>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <input type="text" placeholder="Votre nom" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <input type="email" placeholder="Votre email" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <input type="tel" placeholder="Votre téléphone" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <textarea placeholder="Votre message" rows="4" className={styles.formTextarea}></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>
                Envoyer Message <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ---- Modal prise de rendez-vous ---- */}
      {selectedDoctor && step > 0 && (
        <div className={styles.appointmentOverlay}>
          <div className={styles.appointmentModal}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              ✕
            </button>

            <div className={styles.doctorHeaderCard}>
              <div className={styles.doctorHeaderAvatar}>
  {selectedDoctor.image ? (
    <img src={selectedDoctor.image} alt={`Dr ${selectedDoctor.nom} ${selectedDoctor.prenom}`} />
  ) : (
    <span style={{ fontSize: '32px' }}>👨‍⚕️</span>
  )}
</div>

             {/* Dans la modal de rendez-vous */}
<div className={styles.doctorHeaderInfo}>
  <h3>Dr {selectedDoctor.nom || ''} {selectedDoctor.prenom || ''}</h3>
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
                <p><strong>Docteur :</strong> Dr {selectedDoctor.nom || ''} {selectedDoctor.prenom || ''}</p>
                <p><strong>Spécialité :</strong> {selectedDoctor.specialite?.title}</p>
                <p><strong>Patient :</strong> {patientForm.prenom} {patientForm.nom}</p>
                <p><strong>Email :</strong> {patientForm.email}</p>
                <p><strong>Téléphone :</strong> {patientForm.telephone}</p>
                <p><strong>CIN :</strong> {patientForm.cin}</p>
                <p><strong>Mot de passe :</strong> ••••••••</p>
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

      {/* ---- Modal Détails Service ---- */}
      {showServiceDetails && selectedService && (
        <div className={styles.serviceDetailsOverlay}>
          <div className={styles.serviceDetailsModal}>
            <button 
              className={styles.closeButton} 
              onClick={handleCloseServiceDetails}
            >
              ✕
            </button>

            <div className={styles.serviceDetailsHeader}>
              <div className={styles.serviceDetailsIcon}>
                {iconMap[selectedService.iconName] || <Stethoscope size={32} />}
              </div>
              <div className={styles.serviceDetailsTitle}>
                <h2>{selectedService.title}</h2>
                <p>{selectedService.description}</p>
              </div>
            </div>

            <div className={styles.serviceDetailsContent}>
              {/* Description détaillée depuis la base de données */}
              <div className={styles.serviceDetailsSection}>
                <h3>📋 Description détaillée</h3>
                <p>
                  {selectedService.details && selectedService.details.length > 0 
                    ? selectedService.details
                    : `Notre service de ${selectedService.title.toLowerCase()} offre des soins complets 
                       et personnalisés pour répondre à tous vos besoins de santé. 
                       Nos professionnels qualifiés utilisent des technologies de pointe 
                       pour assurer des diagnostics précis et des traitements efficaces.`
                  }
                </p>
              </div>

              {/* Domaines d'intervention depuis la base de données */}
              {selectedService.details && (
                <div className={styles.serviceDetailsSection}>
                  <h3>🎯 Domaines d'intervention</h3>
                  <ul className={styles.serviceDetailsList}>
                    {typeof selectedService.details === 'string' 
                      ? selectedService.details.split(',').map((detail, index) => (
                          <li key={index}>{detail.trim()}</li>
                        ))
                      : selectedService.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))
                    }
                  </ul>
                </div>
              )}

              {/* Horaires standards */}
              <div className={styles.serviceDetailsSection}>
                <h3>⏱️ Horaires de consultation</h3>
                <div className={styles.serviceSchedule}>
                  <div className={styles.scheduleItem}>
                    <strong>Lun - Ven:</strong> 9h00 - 17h00
                  </div>
                  <div className={styles.scheduleItem}>
                    <strong>Samedi:</strong> 9h00 - 11h30
                  </div>
                  <div className={styles.scheduleItem}>
                    <strong>Urgences:</strong> 24h/24
                  </div>
                </div>
              </div>

              {/* Médecins réels depuis la base de données */}
<div className={styles.serviceDetailsSection}>
  <h3>👨‍⚕️ Médecins spécialisés ({selectedService.doctors?.length || 0})</h3>
  <div className={styles.serviceDoctors}>
    {selectedService.doctors && selectedService.doctors.length > 0 ? (
      selectedService.doctors.map(doctor => (
        <div key={doctor.id} className={styles.serviceDoctorCard}>
          <div className={styles.serviceDoctorImage}>
            {doctor.image ? (
              <img 
                src={doctor.image} 
                alt={`Dr ${doctor.user?.nom || ''} ${doctor.user?.prenom || ''}`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#dbeafe',
              display: doctor.image ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb'
            }}>
              👨‍⚕️
            </div>
          </div>
          <div className={styles.serviceDoctorInfo}>
            <h4>Dr {doctor.user?.nom || doctor.nom || ''} {doctor.user?.prenom || doctor.prenom || ''}</h4>
            <p><strong>Expérience:</strong> {doctor.experiences || 'Expérience confirmée'}</p>
            <p><strong>Langues:</strong> {doctor.languages || doctor.langues || 'Français'}</p>
            <div className={styles.doctorRating}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
              ))}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className={styles.noDoctors}>
        Aucun médecin spécialisé n'est actuellement disponible pour cette spécialité. 
        Veuillez nous contacter pour plus d'informations.
      </p>
    )}
  </div>
</div>

              {/* Statistiques de la spécialité */}
              <div className={styles.serviceDetailsSection}>
                <h3>📊 Notre expertise</h3>
                <div className={styles.serviceStats}>
                  <div className={styles.serviceStat}>
                    <div className={styles.statNumber}>
                      {selectedService.doctors ? selectedService.doctors.length : '0'}+
                    </div>
                    <div className={styles.statLabel}>Médecins experts</div>
                  </div>
                  <div className={styles.serviceStat}>
                    <div className={styles.statNumber}>1000+</div>
                    <div className={styles.statLabel}>Patients traités</div>
                  </div>
                  <div className={styles.serviceStat}>
                    <div className={styles.statNumber}>98%</div>
                    <div className={styles.statLabel}>Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.serviceDetailsActions}>
              <button 
                className={styles.secondaryButton}
                onClick={handleCloseServiceDetails}
              >
                Fermer
              </button>
              <button 
                className={styles.primaryButton}
                onClick={() => {
                  handleCloseServiceDetails();
                  // Prendre RDV avec le premier médecin disponible ou rediriger vers la page médecins
                  if (selectedService.doctors && selectedService.doctors.length > 0) {
                    handleTakeAppointment(selectedService.doctors[0]);
                  } else {
                    // Rediriger vers la page des médecins avec filtre sur la spécialité
                    window.location.href = `/medecins?specialite=${encodeURIComponent(selectedService.title)}`;
                  }
                }}
                disabled={!selectedService.doctors || selectedService.doctors.length === 0}
              >
                {selectedService.doctors && selectedService.doctors.length > 0 
                  ? `Prendre Rendez-vous (${selectedService.doctors.length} médecin(s) disponible(s))`
                  : 'Aucun médecin disponible'
                }
                <Calendar size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Footer ---- */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>🏥 SantéPlus</div>
            <p className={styles.footerDescription}>
              Votre partenaire santé de confiance à Oujda.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4>Liens Rapides</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#accueil">Accueil</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#doctors">Médecins</a></li>
              <li><a href="#urgence">Urgences</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>📞 0536-50-06-01</p>
            <p>📍 12 Rue de la Santé, Oujda</p>
            <p>✉️ contact@clinique-santeplus.ma</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2024 Clinique SantéPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}