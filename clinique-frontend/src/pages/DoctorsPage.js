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

  // Nouvelle logique date + créneau
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');

  // Jours & mois en français
  const frenchDays = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
  const frenchMonths = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  // Créneaux pour semaine / samedi
  const weekdaySlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
  ];

  // Samedi : demi-journée
  const saturdaySlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];

  // Dimanche : aucun créneau
  const getSlotsForDate = (date) => {
    const day = date.getDay(); // 0 = dimanche, 6 = samedi
    if (day === 0) return []; // dimanche fermé
    if (day === 6) return saturdaySlots;
    return weekdaySlots;
  };

  // Une petite "semaine" à partir de selectedDate (7 jours)
  const getWeekDays = (baseDate) => {
  const days = [];
  const start = new Date();
  // si la baseDate est dans le futur, on commence par elle
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
  // empêcher de revenir à un mois passé
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
    'Toutes',
    'Cardiologie',
    'Pédiatrie',
    'Dentisterie',
    'Ophtalmologie',
    'Neurologie',
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

  // Regrouper les médecins par spécialité
  const doctorsBySpecialty = filteredDoctors.reduce((acc, doc) => {
    const specialtyName = doc.specialite?.title || 'Autres';
    if (!acc[specialtyName]) acc[specialtyName] = [];
    acc[specialtyName].push(doc);
    return acc;
  }, {});

  const handleTakeAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(1); // on commence par les infos du patient
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setStep(0);
    setPatientForm({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
    });
    setSelectedDate(new Date());
    setSelectedSlot('');
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
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des médecins groupés par spécialité */}
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
                    <h3>
                      {doc.nom} {doc.prenom}
                    </h3>
                    <p>
                      Spécialité : {doc.specialite?.title || 'Non spécifiée'}
                    </p>
                    <p>Diplômes : {doc.specialite?.description}</p>
                    <p>Actes et soins : {doc.specialite?.details}</p>
                    <p>Expériences : {doc.experiences}</p>
                    <p>Langues : {doc.languages?.join(', ')}</p>

                    <div className={styles.doctorActions}>
                      <Link
                        to={`/medecins/${doc.id}`}
                        className={styles.detailButton}
                      >
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

            {/* Bandeau du médecin */}
            <div className={styles.doctorHeaderCard}>
              <div className={styles.doctorHeaderAvatar}>
                {selectedDoctor.image ? (
                  <img
                    src={selectedDoctor.image}
                    alt={`${selectedDoctor.nom} ${selectedDoctor.prenom}`}
                  />
                ) : (
                  <span>
                    {selectedDoctor.specialite?.iconName || '👨‍⚕️'}
                  </span>
                )}
              </div>
              <div className={styles.doctorHeaderInfo}>
                <h3>
                  Dr {selectedDoctor.nom} {selectedDoctor.prenom}
                </h3>
                <p className={styles.headerSpecialty}>
                  {selectedDoctor.specialite?.title}
                </p>
                <p className={styles.headerLocation}>
                  <MapPin size={14} /> Oujda Principal Oujda
                </p>
              </div>
            </div>

            <h2>Prendre rendez-vous</h2>

            {/* Étape 1 : Infos patient */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <h3>Vos informations</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                >
                  <label>
                    Nom :
                    <input
                      type="text"
                      value={patientForm.nom}
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,
                          nom: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Prénom :
                    <input
                      type="text"
                      value={patientForm.prenom}
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,
                          prenom: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Email :
                    <input
                      type="email"
                      value={patientForm.email}
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Téléphone :
                    <input
                      type="tel"
                      value={patientForm.telephone}
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,
                          telephone: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <div className={styles.stepActions}>
                    <button type="button" onClick={handleCloseModal}>
                      Annuler
                    </button>
                    <button type="submit">Continuer</button>
                  </div>
                </form>
              </div>
            )}

            {/* Étape 2 : Date & créneau avec style calendrier/créneaux */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <div className={styles.appointmentBody}>
                  <h3 className={styles.sectionSubtitleSmall}>
                    Veuillez choisir la date du rendez-vous
                  </h3>

                  {/* Header mois */}
                  <div className={styles.calendarHeader}>
                    <button type="button" onClick={goToPrevMonth}>
                      <ChevronLeft size={18} />
                    </button>
                    <span>
                      {frenchMonths[selectedDate.getMonth()]}{' '}
                      {selectedDate.getFullYear()}
                    </span>
                    <button type="button" onClick={goToNextMonth}>
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Jours */}
                  <div className={styles.daysRow}>
                    {getWeekDays(selectedDate).map((d) => {
                      const isSelected =
                        d.toDateString() === selectedDate.toDateString();
                      const dayName = frenchDays[d.getDay()];
                      const dayNumber = d.getDate();
                      const monthShort = d.toLocaleDateString('fr-FR', {
                        month: 'short',
                      });
                      const isSunday = d.getDay() === 0;
                      const isPast = d < new Date(new Date().setHours(0,0,0,0)); // date passée
                      return (
                        <button
  key={d.toISOString()}
  type="button"
  className={`${styles.dayCard} ${isSelected ? styles.dayCardSelected : ''} ${isSunday ? styles.dayCardDisabled : ''} ${isPast ? styles.dayCardDisabled : ''}`}
  onClick={() => {
    if (!isSunday && !isPast) {
      setSelectedDate(d);
      setSelectedSlot('');
    }
  }}
  disabled={isSunday || isPast}
>
  <span className={styles.dayName}>{dayName}</span>
  <span className={styles.dayNumber}>{dayNumber}</span>
  <span className={styles.dayMonth}>{monthShort}</span>
</button>
                      );
                    })}
                  </div>

                  {/* Créneaux */}
                  <h3 className={styles.sectionSubtitleSmall}>
                    Veuillez choisir l'heure du rendez-vous
                  </h3>

                  <div className={styles.slotsGrid}>
                    {getSlotsForDate(selectedDate).length === 0 ? (
                      <p className={styles.noSlotsText}>
                        Aucun créneau disponible ce jour-là (dimanche).
                      </p>
                    ) : (
                      getSlotsForDate(selectedDate).map((slot) => {
                        // plus tard: tu pourras mettre isDisabled selon le backend
                        const isDisabled = false;
                        const isSelected = selectedSlot === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            className={`${styles.slotButton} ${
                              isSelected ? styles.slotButtonSelected : ''
                            } ${
                              isDisabled ? styles.slotButtonDisabled : ''
                            }`}
                            onClick={() => {
                              if (!isDisabled) setSelectedSlot(slot);
                            }}
                            disabled={isDisabled}
                          >
                            {slot}
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" onClick={() => setStep(1)}>
                      ⬅ Retour
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedSlot) {
                          alert('Veuillez choisir un créneau horaire.');
                          return;
                        }
                        setStep(3);
                      }}
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3 : Confirmation */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <h3>Confirmation du rendez-vous</h3>
                <p>
                  <strong>Docteur :</strong> {selectedDoctor.nom}{' '}
                  {selectedDoctor.prenom}
                </p>
                <p>
                  <strong>Spécialité :</strong>{' '}
                  {selectedDoctor.specialite?.title}
                </p>
                <p>
                  <strong>Patient :</strong> {patientForm.prenom}{' '}
                  {patientForm.nom}
                </p>
                <p>
                  <strong>Email :</strong> {patientForm.email}
                </p>
                <p>
                  <strong>Téléphone :</strong> {patientForm.telephone}
                </p>
                <p>
                  <strong>Date :</strong>{' '}
                  {selectedDate.toLocaleDateString('fr-FR')}
                </p>
                <p>
                  <strong>Créneau :</strong> {selectedSlot}
                </p>

                <div className={styles.stepActions}>
                  <button type="button" onClick={() => setStep(2)}>
                    ⬅ Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // TODO: appel backend pour enregistrer le RDV
                      // ex:
                      // createAppointment({
                      //   doctorId: selectedDoctor.id,
                      //   patient: patientForm,
                      //   date: selectedDate.toISOString(),
                      //   slot: selectedSlot,
                      // });
                      alert('Rendez-vous confirmé (simulation).');
                      handleCloseModal();
                    }}
                  >
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
