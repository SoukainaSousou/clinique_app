import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './layout/Navbar';
import { 
  Stethoscope, Users, ClipboardList, Phone, 
  Calendar, Clock, MapPin, ArrowRight,
  Heart, Eye, Brain, Star, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './CliniqueInfo.module.css';
import { getDoctors } from '../services/medecinService'; // ✅ on importe ton service

// Icônes personnalisées
const CustomIcons = {
  Pediatrie: () => <span style={{ fontSize: '24px' }}>👶</span>,
  Dentisterie: () => <span style={{ fontSize: '24px' }}>🦷</span>,
  Analyses: () => <span style={{ fontSize: '24px' }}>🔬</span>
};

const iconMap = {
  Heart: <Heart size={24} />,
  Eye: <Eye size={24} />,
  Brain: <Brain size={24} />,
  Stethoscope: <Stethoscope size={24} />,
  Baby: <CustomIcons.Pediatrie />,
  Microscope: <CustomIcons.Analyses />,
};

export default function CliniqueInfo() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Charger les services depuis l’API
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

  // Charger les médecins depuis l’API (comme dans DoctorsPage.jsx)
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
            <button className={styles.primaryButton}>
              Prendre Rendez-vous <ArrowRight size={16} />
            </button>
            <button className={styles.secondaryButton}>
              Urgence <Phone size={16} />
            </button>
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
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
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
                  {iconMap[service.iconName] || <Stethoscope size={24} />}
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <button className={styles.serviceButton}>
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
                    <img src={doc.image} alt={`${doc.nom} ${doc.prenom}`} />
                  ) : (
                    <span>{doc.specialite?.iconName || "👨‍⚕️"}</span>
                  )}
                </div>
                <div className={styles.doctorInfo}>
                  <h3>{doc.nom} {doc.prenom}</h3>
                  <p>Spécialité : {doc.specialite?.title || "Non spécifiée"}</p>
                  <p>Expériences : {doc.experiences}</p>
                  <p>Langues : {doc.languages?.join(", ")}</p>

                  <div className={styles.doctorRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>

                  <div className={styles.doctorActions}>
                    <Link to={`/medecins/${doc.id}`} className={styles.doctorButton}>
                      Voir Profil <ArrowRight size={14} />
                    </Link>
                    <button className={styles.doctorButton}>
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
                  <p>Lun - Ven: 8h-20h<br/>Sam: 8h-14h</p>
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